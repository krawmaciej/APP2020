var mongodb = require('mongodb');
var common = require('./common');
var restHelper = require('./restHelper');

var rest = module.exports = {

    'login': function(arg) { restHelper.login(arg) }, // funkcja po wywolaniu rest[login] ?, wywolije resthelper login

    'person': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        var aggregation = [{ $lookup: { from: 'groups', localField: 'memberOf', foreignField: '_id', as: 'groups' } }];
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

    'person.memberof' : function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        var aggregation = [ { $project: { memberOf: 1 } } ];

        var preparation = function(person) {
            if(person.memberOf) {
                try {
                    person.memberOf = mongodb.ObjectId(person.memberOf);
                } catch(ex) {}
            } else person.memberOf = null;
        };

        restHelper.manageSingleObject(common.persons, arg, aggregation, preparation);
    },

    /*
    'person.groups.members': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        var aggregation = [{
            $lookup: {
                from: 'groups',
                let: { memberOf: '$memberOf' },
                pipeline: [{
                    $match: {
                      $expr: {
                        $in: ['$_id', { $cond: { if: { $isArray: '$$memberOf' }, then: '$$memberOf', else: [ ] } }]
                      }
                    }
                }, {
                    $project: { members: 1 }
                }],
                as: 'groups'
            } 
        }, {
            $project: { _id: 0, groups: 1 }
        } ];
        
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
    */

    'persons': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1, 2 ])) return;

        var aggregation = {
            $lookup: {
                from: 'groups',
                let: { memberOf: '$memberOf' },
                pipeline: [{
                    $match: {
                      $expr: {
                        $in: ['$_id', { $cond: { if: { $isArray: '$$memberOf' }, then: '$$memberOf', else: [ ] } }]
                      }
                    }
                }, {
                    $project: { name: 1 }
                }],
                as: 'groups'
            }
        };
        
        //    $lookup: { from: 'groups', localField: 'memberOf', foreignField: '_id', as: 'groups' } }
        
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
        var aggregation = [{ $lookup: { from: 'persons', localField: 'members', foreignField: '_id', as: 'persons' } }];
        var preparation = function(group) {
            if(group.members && group.members.length > 0) {
                for(var i in group.members) {
                    try {
                        group.members[i] = mongodb.ObjectId(group.members[i]);
                    } catch(ex) {}
                }
            } else group.members = [];
            delete group.persons;
        };
        restHelper.manageSingleObject(common.groups, arg, aggregation, preparation);
    },

    'group.members': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        
        var aggregation = [ { $project: { members: 1 } } ];

        var preparation = function(group) {
            if(group.members) {
                try {
                    group.members = mongodb.ObjectId(group.members);
                } catch(ex) {}
            } else group.members = null;
        };

        restHelper.manageSingleObject(common.groups, arg, aggregation, preparation);
    },

    /*
    'group.members.memberof': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        //var aggregation = { $lookup: { from: 'persons', localField: 'members', foreignField: '_id', as: 'persons' } };
        var aggregation = [{
            $lookup: {
                from: 'persons',
                let: { members: '$members' },
                pipeline: [{
                    $match: {
                      $expr: {
                        $in: ['$_id', { $cond: { if: { $isArray: '$$members' }, then: '$$members', else: [ ] } }]
                      }
                    }
                }, {
                    $project: { memberOf: 1 }
                }],
                as: 'persons'
            } 
        }, {
            $project: { _id: 0, persons: 1 }
        } ];

        var preparation = function(group) {
            if(group.members && group.members.length > 0) {
                for(var i in group.members) {
                    try {
                        group.members[i] = mongodb.ObjectId(group.members[i]);
                    } catch(ex) {}
                }
            } else group.members = [];
            delete group.persons;
        };
        restHelper.manageSingleObject(common.groups, arg, aggregation, preparation);
    },
    */

    'groups': function(arg) {
        if(!restHelper.checkAccess(arg, [ 1 ])) return;
        // without members field
        var aggregation = {
            $project: {
               name: 1,
               description: 1,
               numberOfMembers: { $cond: { if: { $isArray: "$members" }, then: { $size: "$members" }, else: 0} }
            }
        };
        /*
        // with all fields
        var aggregation = { 
            $addFields: {
            numberOfMembers: { $cond: { if: { $isArray: "$members" }, then: { $size: "$members" }, else: 0} } }
        };
        */

        restHelper.getObjects(common.groups, arg, 10, aggregation, {
            $or: [ {
                name: { $regex: new RegExp(arg.query.search, 'i') } }, {
                description: { $regex: new RegExp(arg.query.search, 'i') } }
            ]
        });
    }

};