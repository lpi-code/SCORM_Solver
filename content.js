(function () {
    const script = document.createElement('script');
    script.textContent = `
        (function () {
            function detectVersion(api) {
                if (typeof api.SetValue   === 'function' && typeof api.Commit    === 'function') return '2004';
                if (typeof api.LMSSetValue === 'function' && typeof api.LMSCommit === 'function') return '1.2';
                return null;
            }

            // Search a window for any object that responds like a SCORM API.
            function findApiInWindow(win) {
                try {
                    // Known standard names first
                    for (const name of ['API_1484_11', 'API']) {
                        try {
                            const obj = win[name];
                            if (obj) {
                                const v = detectVersion(obj);
                                if (v) return { api: obj, version: v, name };
                            }
                        } catch (e) {}
                    }
                    // Brute-force: scan every global for SCORM duck-typing
                    for (const key of Object.keys(win)) {
                        try {
                            const obj = win[key];
                            if (obj && typeof obj === 'object') {
                                const v = detectVersion(obj);
                                if (v) {
                                    console.log('[SCORM Solver] Found API under non-standard name:', key);
                                    return { api: obj, version: v, name: key };
                                }
                            }
                        } catch (e) {}
                    }
                } catch (e) {}
                return null;
            }

            function findApi(win, depth) {
                if (!win || depth > 10) return null;
                const found = findApiInWindow(win);
                if (found) return found;
                try {
                    for (let i = 0; i < win.frames.length; i++) {
                        const r = findApi(win.frames[i], depth + 1);
                        if (r) return r;
                    }
                } catch (e) {}
                return null;
            }

            function getApi() {
                return findApi(window.top, 0) ||
                       findApi(window.parent, 0) ||
                       findApi(window, 0);
            }

            function inject(api, version) {
                if (version === '1.2') {
                    api.LMSSetValue("cmi.core.score.raw",     "100");
                    api.LMSSetValue("cmi.core.lesson_status", "passed");
                    api.LMSCommit("");
                    api.LMSFinish("");
                } else {
                    api.SetValue("cmi.score.raw",         "100");
                    api.SetValue("cmi.score.scaled",      "1.0");
                    api.SetValue("cmi.success_status",    "passed");
                    api.SetValue("cmi.completion_status", "completed");
                    api.Commit("");
                    api.Terminate("");
                }
            }

            function tryInject() {
                const found = getApi();
                if (!found) return false;
                try {
                    inject(found.api, found.version);
                    console.log('[SCORM Solver] Injected via', found.name, '(SCORM ' + found.version + ')');
                    return true;
                } catch (e) {
                    console.warn('[SCORM Solver] API found (' + found.name + ') but inject failed:', e.message);
                    return false;
                }
            }

            if (!tryInject()) {
                let attempts = 0;
                const poll = setInterval(function () {
                    attempts++;
                    if (tryInject() || attempts >= 120) {
                        clearInterval(poll);
                        if (attempts >= 120) {
                            console.warn('[SCORM Solver] No SCORM API found after 60s');
                            console.log('[SCORM Solver] Top-level globals:', Object.keys(window.top).join(', '));
                        }
                    }
                }, 500);
            }
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
})();
