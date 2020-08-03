// send codes/data/payload

var lib = module.exports = {

    sendJson: (rep, obj) => {
        //console.log("sent JSON: " + JSON.stringify(obj));
        rep.writeHead(200, 'OK', {'Content-Type':'application/json'}
        );
        rep.write(JSON.stringify(obj));
        rep.end();
    },

    sendError: function(rep, code, msg) {
        console.log("sent error: " + JSON.stringify({ error: msg }));
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
                //console.log("sent payload: " + payload);
            } catch(ex) {
                lib.sendError(rep, 400, 'Broken data');
            }
        });
    }

};