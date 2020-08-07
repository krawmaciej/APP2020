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
    var getPersonMemberOf = function (personID, callback) {
        $http.get("/person?_id=" + personID).then(
            function(rep) {
                var personMemberOf = rep.data.memberOf ? rep.data.memberOf : [ ];
                callback(personID, personMemberOf);
            },
            function(err) {}
        );
    }

    var getGroupMembers = function (groupID, callback) {
        $http.get("/group?_id=" + groupID).then(
            function(rep) {
                var groupMembers = rep.data.members ? rep.data.members : [ ];
                callback(groupMembers);
            },
            function(err) {}
        );
    }

    var deleteGroupFromPersons = function(groupID, notMembers) {
        for (var i = 0; i < notMembers.length; ++i) {
            getPersonMemberOf(notMembers[i], 
                function(personID, personMemberOf) {
                    var index = personMemberOf.indexOf(groupID);
                    if (index > -1) {
                        personMemberOf.splice(index, 1);
                        var personToModify = { _id: personID, memberOf: personMemberOf };
                        $http.put("/person", personToModify);
                    }
                }
            );
        }
    }

    var addGroupToPersons = function(groupID, members) {
        for (var i = 0; i < members.length; ++i) {
            getPersonMemberOf(members[i], 
                function(personID, personMemberOf) {
                    if (!personMemberOf.includes(groupID)) {
                        personMemberOf.push(groupID);
                        var personToModify = { _id: personID, memberOf: personMemberOf };
                        $http.put("/person", personToModify);
                    }
                }
            );
        }
    }

    var difference = function(a, b) {
        return a.filter(function(aElem) {
            return !b.includes(aElem);
        });
    };

    var changeGroup = function(data) {
        // update persons
        getGroupMembers(data._id, function(groupMembers) {
            data.members = data.members ? data.members : [];

            var toDelete = difference(groupMembers, data.members);
            var toAdd = difference(data.members, groupMembers);

            deleteGroupFromPersons(data._id, toDelete);
            addGroupToPersons(data._id, toAdd);
        });
        
        // update group
        $http.put("/group", data).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    };

    var deleteGroup = function(id) {
        getGroupMembers(id, function(groupMembers) {
            deleteGroupFromPersons(id, groupMembers);
        });

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
                data.members = data.members ? data.members : [];
                addGroupToPersons(rep.data._id, data.members);
                
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    };

}]);