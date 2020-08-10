var mongodb = require('mongodb'); //db
var lib = require('./lib'); //HTTPREST
var common = require('./common'); // initialize db, also session

var restHelper = module.exports = {

    login: function(arg) {
        if(!common.sessions[arg.session]) {
            lib.sendError(arg.response, 404, 'Session not found');
            return;
        }
        switch(arg.method) {
            case 'GET':
                lib.sendJson(arg.response, common.sessions[arg.session]);
                break;
            case 'POST':
                if(!arg.payload.login) {
                    lib.sendError(arg.response, 401, 'No login specified');
                    return;        
                }
                common.users.findOne({ login: arg.payload.login, password: arg.payload.password }, function(err, validUser) {
                    if(err || !validUser) {
                        lib.sendError(arg.response, 401, 'Authentification failed');
                        return;            
                    }
                    common.sessions[arg.session].login = validUser.login;
                    common.sessions[arg.session].role = validUser.role;
                    lib.sendJson(arg.response, common.sessions[arg.session]);    
                });
                break;
            case 'DELETE':
                common.sessions[arg.session].login = null;
                common.sessions[arg.session].role = 0;
                lib.sendJson(arg.response, common.sessions[arg.session]);
                break;                
            default:
                lib.sendError(arg.response, 400, 'Invalid method');
        }
    },

    checkAccess: function(arg, roles) {
        // if session exists? and if it has roles needed
        var result = common.sessions[arg.session] && roles.includes(common.sessions[arg.session].role);
        if(!result) {
            lib.sendError(arg.response, 403, 'Access denied');
        }
        return result;
    },

    manageSingleObject: function(collection, arg, aggregation, preparation) {
        switch(arg.method) {
            case 'GET':
                try {
                    if(!aggregation) aggregation = [ { $skip: 0 } ];
                    aggregation.unshift({ $match: { _id: mongodb.ObjectId(arg.query._id) } });

                    collection.aggregate(aggregation).toArray(
                        function(err, docs) {
                            if(!err && docs.length > 0) {
                                lib.sendJson(arg.response, docs[0]);
                            } else {
                                lib.sendError(arg.response, 404, 'Not found');
                            }
                        });
                } catch(ex) {
                    lib.sendError(arg.response, 400, 'Invalid query');
                    console.log(ex);
                }
                break;
            case 'PUT':
                try {
                    var id = mongodb.ObjectId(arg.payload._id);
                    delete arg.payload._id;
                    if(preparation) preparation(arg.payload);
                    // switch handles undefined as default
                    switch(arg.payload.action) {
                        case 'add':
                            delete arg.payload.action;
                            var action = { $push: arg.payload };
                            break;
                        case 'remove':
                            delete arg.payload.action;
                            var action = { $pull: arg.payload };
                            break;
                        default:
                            var action = { $set: arg.payload };
                    }
                    console.log('PUT id=' + id + ' action=' + JSON.stringify(action));
                    collection.findOneAndUpdate({ _id: id },
                                                action,
                                                { returnOriginal: false }, function(err, updated) {
                        if(!err) {
                            lib.sendJson(arg.response, updated.value);
                        } else {
                            lib.sendError(arg.response, 403, 'Update failed');
                        }
                    });
                } catch(ex) {
                    lib.sendError(arg.response, 400, 'Invalid query');
                }
                break;
            case 'POST':
                if(preparation) preparation(arg.payload);
                collection.insertOne(arg.payload, function(err, inserted) {
                    if(!err) {
                        //console.log('pload=' + JSON.stringify(arg.payload));
                        //console.log('arg.resp=' + JSON.stringify(arg.response));
                        //console.log('inserted.ops[0]=' + JSON.stringify(inserted.ops[0]));
                        //console.log('inserted.ops=' + JSON.stringify(inserted.ops));
                        //console.log('inserted=' + JSON.stringify(inserted));
                        lib.sendJson(arg.response, inserted.ops[0]);
                    } else {
                        lib.sendError(arg.response, 400, 'Insert failed');
                    }
                });
                break;
            case 'DELETE':
                try {
                    var id = mongodb.ObjectId(arg.query._id);
                    collection.findOneAndDelete({ _id: id }, function(err, deleted) {
                        if(!err) {
                            lib.sendJson(arg.response, deleted.value);
                        } else {
                            lib.sendError(arg.response, 403, 'Delete failed');
                        }
                    });
                } catch(ex) {
                    lib.sendError(arg.response, 400, 'Invalid query');
                }
                break;
            default:
                sendError(arg.response, 400, 'Invalid method');
        }
    },

    getObjects: function(collection, arg, defaultLimit, aggregation, searchQuery) {
        switch(arg.method) {
            case 'GET':
                var limit = parseInt(arg.query.limit);
                if(isNaN(limit) || limit <= 0) limit = defaultLimit;
                var skip = parseInt(arg.query.skip);
                if(isNaN(skip) || skip <= 0) skip = 0;

                if(!aggregation) aggregation = { $skip: 0 };

                collection.aggregate([
                    { $facet:
                        {
                            total: [
                                { $count: 'count' }
                            ],
                            filtered: [
                                aggregation,
                                { $match: searchQuery },
                                { $count: 'count' }
                            ],
                            data: [
                                aggregation,
                                { $match: searchQuery },
                                { $skip: skip },
                                { $limit: limit }
                            ]
                        }
                    }
                ]).toArray(function(err, docs) {
                    if(!err && docs.length > 0) {
                        lib.sendJson(arg.response, {
                            data: docs[0].data,
                            count: docs[0].total[0] ? docs[0].total[0].count : 0,
                            filtered: docs[0].filtered[0] ? docs[0].filtered[0].count : 0
                        });
                    } else {
                        console.log(err);
                        lib.sendError(arg.response, 404, 'Not found');
                    }
                });
                break;
            default:
                lib.sendError(arg.response, 400, 'Invalid method');
        }
    }
        
};