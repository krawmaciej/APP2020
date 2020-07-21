var lib = module.exports = {

    sendJson: function(rep, obj) {
        rep.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
        rep.write(JSON.stringify(obj));
        rep.end();
    },

    sendError: function(rep, code, msg) {
        rep.writeHead(code, msg, { 'Content-Type': 'application/json' });
        rep.write(JSON.stringify({ error: msg }));
        rep.end();
    },

    getPayload: function(req, rep, callback) {
        var payload = '';
        req.on("data", function(data) {
            payload += data;
        }).on("end", function() {
            try {
                payload = payload.trim();
                callback(rep, payload ? JSON.parse(payload) : {});
            } catch(ex) {
                lib.sendError(rep, 400, 'Broken data');
            }
        });
    }

};