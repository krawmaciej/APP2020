// initialize with data if needed

var config = require('./config'); // data to be initialized
var reset = false; // reset data to initial state

// holds collections references
var common = module.exports = {

    // sessions: key is session id, value is an object
    sessions: {},

    users: null,
    persons: null,
    groups: null,

    initializeData: function(db) {

        common.users = db.collection("users");
        common.users.countDocuments({}, function(err, n) {
            if (reset) {
                common.users.deleteMany();
                n = 0;
            }
            if (!err && n <= 0) {
                console.log("Initializing users with example data (" + config.exampleUsers.length + " records)");
                common.users.insertMany(config.exampleUsers);
            }
        });    

        common.persons = db.collection("persons");
        common.persons.countDocuments({}, function(err, n) {
            if (reset) {
                common.persons.deleteMany();
                n = 0;
            }
            if(!err && n <= 0) {
                console.log("Initializing persons with example data (" + config.examplePersons.length + " records)");
                common.persons.insertMany(config.examplePersons);
            }
        });    

        common.groups = db.collection("groups");
        if(common.groups.countDocuments({}, function(err, n) {
            if (reset) {
                common.groups.deleteMany();
                n = 0;
            }
            if(!err && n <= 0) {
                console.log("Initializing groups with example data (" + config.exampleGroups.length + " records)");
                common.groups.insertMany(config.exampleGroups);
            }
        }));    

    }

};