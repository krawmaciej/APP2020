var mongodb = require('mongodb');
var common = require('./common');
var restHelper = require('./restHelper');

var rest = module.exports = {

    'login': function(arg) { restHelper.login(arg) }, // funkcja po wywolaniu rest[login] ?, wywolije resthelper login

    'person': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        var aggregation = { $lookup: { from: 'groups', localField: 'memberOf', foreignField: '_id', as: 'groups' } };
        var preparation = function(person) {
            if(person.memberOf && person.memberOf.length > 0) {
                for(var i in person.memberOf) {
                    try {
                        person.memberOf[i] = mongodb.ObjectId(person.memberOf[i]);
                    } catch(ex) {}
                }
            } else person.memberOf = [];
            delete person.groups;
        };
        restHelper.manageSingleObject(common.persons, arg, aggregation, preparation);
    },

    'persons': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1, 2 ])) return;
        var aggregation = { $lookup: { from: 'groups', localField: 'memberOf', foreignField: '_id', as: 'groups' } };
        restHelper.getObjects(common.persons, arg, 10, aggregation, {
            $or: [
                { firstName: { $regex: new RegExp(arg.query.search, 'i') } },
                { lastName: { $regex: new RegExp(arg.query.search, 'i') } },
                { groups: { $elemMatch: { name: { $regex: new RegExp(arg.query.search, 'i') } } } }
            ]
        });
    },

    'group': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        restHelper.manageSingleObject(common.groups, arg, null, null);
    },

    'groups': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1, 2 ])) return;
        restHelper.getObjects(common.groups, arg, 10, null, {
            name: new RegExp(arg.query.search, 'i')
        });
    }

};