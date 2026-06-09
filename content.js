(function () {
    const win = window.wrappedJSObject;
    const origFetch = win.fetch;

    win.fetch = exportFunction(function (...args) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
        const method = ((args[1] && args[1].method) || 'GET').toUpperCase();
        const body = args[1] && args[1].body;

        if (url.includes('university.oxya.com')) {
            try { console.log('[360L REQ]', method, url, body ? JSON.parse(body) : ''); }
            catch (e) { console.log('[360L REQ]', method, url, body || ''); }

            const promise = origFetch.apply(win, args);
            promise.then(function (res) {
                res.clone().json()
                    .then(function (d) { console.log('[360L RES]', method, url, JSON.stringify(d).slice(0, 500)); })
                    .catch(function () {});
            });
            return promise;
        }

        return origFetch.apply(win, args);
    }, win);

    console.log('[SCORM Solver] Interceptor active (wrappedJSObject)');
})();
