(function () {
    const script = document.createElement('script');
    script.textContent = `
        (function () {
            // Recursively search a window tree for a SCORM API object.
            // Returns { api, version } or null. Catches cross-origin access errors.
            function findApi(win, depth) {
                if (!win || depth > 10) return null;
                try {
                    if (win.API_1484_11) return { api: win.API_1484_11, version: '2004' };
                    if (win.API)         return { api: win.API,         version: '1.2'  };
                } catch (e) {}
                try {
                    for (let i = 0; i < win.frames.length; i++) {
                        const found = findApi(win.frames[i], depth + 1);
                        if (found) return found;
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
                    api.LMSSetValue("cmi.core.score.raw",    "100");
                    api.LMSSetValue("cmi.core.lesson_status", "passed");
                    api.LMSCommit("");
                    api.LMSFinish("");
                } else {
                    api.SetValue("cmi.score.raw",        "100");
                    api.SetValue("cmi.score.scaled",     "1.0");
                    api.SetValue("cmi.success_status",   "passed");
                    api.SetValue("cmi.completion_status","completed");
                    api.Commit("");
                    api.Terminate("");
                }
                console.log('[SCORM Solver] Injected (SCORM ' + version + ')');
            }

            function tryInject() {
                const found = getApi();
                if (!found) return false;
                try {
                    inject(found.api, found.version);
                    return true;
                } catch (e) {
                    console.warn('[SCORM Solver] Inject failed:', e.message);
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
                            console.warn('[SCORM Solver] No SCORM API found after 60s — open console and run: console.log(Object.keys(window)) to inspect globals');
                        }
                    }
                }, 500);
            }
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
})();
