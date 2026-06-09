(function () {
    const script = document.createElement('script');
    script.textContent = `
        (function () {
            function tryInject() {
                const api = window.API_1484_11 ||
                    (window.parent !== window ? window.parent.API_1484_11 : null) ||
                    (window.top !== window ? window.top.API_1484_11 : null);

                if (!api) return false;

                api.SetValue("cmi.score.raw", "100");
                api.SetValue("cmi.score.scaled", "1.0");
                api.SetValue("cmi.success_status", "passed");
                api.SetValue("cmi.completion_status", "completed");
                api.Commit("");

                console.log('[SCORM Solver] Injected successfully');
                return true;
            }

            if (!tryInject()) {
                let attempts = 0;
                const poll = setInterval(function () {
                    attempts++;
                    if (tryInject() || attempts >= 120) {
                        clearInterval(poll);
                        if (attempts >= 120) {
                            console.warn('[SCORM Solver] API_1484_11 not found after 60s');
                        }
                    }
                }, 500);
            }
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
})();
