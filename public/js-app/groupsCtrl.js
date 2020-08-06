var app = angular.module('app2020');

app.controller('GroupsCtrl', ['$scope', '$http', '$uibModal', 'common', function($scope, $http, $uibModal, common) {
    var ctrl = this;

    ctrl.groups = [];
    ctrl.groupsCount = 0;
    ctrl.groupsFiltered = 0;
    ctrl.limit = 10;
    ctrl.search = '';

    ctrl.loadGroups = function(callback = null) {
        $http.get("/groups?limit=" + ctrl.limit + "&search=" + ctrl.search).then(
            function(rep) {
                ctrl.groups = rep.data.data;

                console.log('ctrl.groups=' + ctrl.groups);
                //stupido to change
                /*
                for(var group in ctrl.groups) {
                    group.numberOfMembers = group.persons.length;
                    console.log('group=' + group);
                    console.log('group.persons=' + group.persons);
                    console.log('group.persons.length=' + group.persons.length);
                }
                */

                ctrl.groupsCount = rep.data.count;
                ctrl.groupsFiltered = rep.data.filtered;
                if(callback) callback();
            },
            function(err) {
                ctrl.groups = [];
                ctrl.groupsCount = 0;
                ctrl.groupsFiltered = 0;                
            }
        );
    };

    ctrl.increaseLimit = function() {
        ctrl.limit += 5;
        ctrl.loadGroups();
    }

    var editGroup = function(options) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'editGroupDialog.html',
            controller: 'EditGroupCtrl',
            controllerAs: 'ctrl',
            resolve: {
                editGroupOptions: function () {
                    return options;
                }
            }
        });

        modalInstance.result.then(
            function (ret) {
                switch(ret) {
                    // get data from edit/new dialog and use it
                    // sends according http requests
                    case 'save':
                        if(options.data._id) {
                            changeGroup(options.data);
                        } else {
                            insertGroup(options.data);
                        }
                        break;
                    case 'delete':
                        deleteGroup(options.data._id);
                        break;
                }
            },
            function (err) {}
        );

    };

    ctrl.clickGroup = function(id) {
        $http.get("/group?_id=" + id).then(
            function(rep) {
                var editGroupOptions = { data: rep.data };
                editGroup(editGroupOptions);
            },
            function(err) {}
        );
    };

    ctrl.new = function() {
        var editGroupOptions = { data: {}, noDelete: true };
        editGroup(editGroupOptions);
    };

    ctrl.limitReached = function() {
        return ctrl.groupsFiltered <= ctrl.limit;
    };

    // the first call
    ctrl.loadGroups();

    // db relation helpers
    var getPersonMemberOf = function (personID) {
        $http.get("/person?_id=" + personID).then(
            function(rep) {
                return rep.data.memberOf ? rep.data.memberOf : [];
            },
            function(err) {}
        );
    }


    var deleteGroupFromPersons = function(data) {

    }

    var addGroupToPersons = function(data) {
        if (!data.members) return;
        for (var i = 0; i < data.members.length; ++i) {
            $http.get("/person?_id=" + data.members[i]).then(
                function(rep) {
                    var personMemberOf = rep.data.memberOf ? rep.data.memberOf : [ ];

                    if (!personMemberOf.includes(data._id)) {
                        var personToModify = { _id: rep.data._id, memberOf: personMemberOf };
                        personToModify.memberOf.push(data._id);
                        $http.put("/person", personToModify);
                    }
                },
                function(err) {}
            );
        }
    }

    var changeGroup = function(data) {
        // maybe needs to be replaced by rest calls to servers
        // because of pagination, might persons from other pages
        // not be included in data.persons
        // in that case list of members should be saved before modyfication
        // data contains id of a group, however data of members is already modyfied
        console.log('data.members=' + JSON.stringify(data.members));
        // but if you get group from mongo by it's id, member list should be different
        $http.get("/group?_id=" + data._id).then(
            function(rep) {
                console.log('rep.members=' + JSON.stringify(rep.data.members));
            },
            function(err) {}
        );
         

        /*
        if (!data.persons) return;
        for (var i = 0; i < data.persons.length; ++i) {
            $http.get("/person?_id=" + data.persons[i]._id).then(
                function(rep) {
                    var personMemberOf = rep.data.memberOf ? rep.data.memberOf : [ ];

                    // if is a member of group
                    var index = personMemberOf.indexOf(data._id);
                    if (index > -1) {
                        var personToModify = { _id: rep.data._id, memberOf: personMemberOf };
                        personToModify.memberOf.push(data._id);
                        $http.put("/person", personToModify);
                    }
                },
                function(err) {}
            );
        }
        */

        addGroupToPersons(data);
        
        // need to get memberof table for each new person
        // use id from members to append memberof tables with group id
        // also need to remove id from memberof of deleted persons
        // ^^^^ get from data.persons[i]._id and remove group id from memberOf
        /* useful
                for (var i = 0; i < data.persons.length; ++i) {
                    data.persons[i].memberOf.push(data._id);
                    console.log(JSON.stringify(data.persons[i].memberOf));
                }
        */
        
        $http.put("/group", data).then(
            function(rep) {
                // to delete
                console.log('whole data=' + JSON.stringify(data));
                /* useful
                for (var i = 0; i < data.persons.length; ++i) {
                    data.persons[i].memberOf.push(data._id);
                    console.log(JSON.stringify(data.persons[i].memberOf));
                }
                */
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    };

    var deleteGroup = function(id) {
        $http.delete("/group?_id=" + id).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane usunięte');
            },
            function(err) {}
        );
    };

    var insertGroup = function(data) {
        $http.post("/group", data).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    };

}]);