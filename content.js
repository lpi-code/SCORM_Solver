(function () {
    const script = document.createElement('script');
    script.textContent = `
        (function () {
            const BASE = 'university.oxya.com';
            const orig = window.fetch;

            window.fetch = async function(...args) {
                const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
                const method = (args[1]?.method || 'GET').toUpperCase();
                const body = args[1]?.body;

                if (url.includes(BASE)) {
                    try { console.log('[360L REQ]', method, url, body ? JSON.parse(body) : ''); }
                    catch(e) { console.log('[360L REQ]', method, url, body || ''); }
                }

                const res = await orig.apply(this, args);

                if (url.includes(BASE)) {
                    res.clone().json()
                        .then(d => console.log('[360L RES]', method, url, d))
                        .catch(() => {});
                }

                return res;
            };

            console.log('[SCORM Solver] Network interceptor active');
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
})();
