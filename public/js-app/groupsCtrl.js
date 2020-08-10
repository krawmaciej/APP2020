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
    }

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

    }

    ctrl.clickGroup = function(id) {
        $http.get("/group?_id=" + id).then(
            function(rep) {
                var editGroupOptions = { data: rep.data };
                editGroup(editGroupOptions);
            },
            function(err) {}
        );
    }

    ctrl.new = function() {
        var editGroupOptions = { data: {}, noDelete: true };
        editGroup(editGroupOptions);
    }

    ctrl.limitReached = function() {
        return ctrl.groupsFiltered <= ctrl.limit;
    }

    // the first call
    ctrl.loadGroups();

    // db relation helpers
    var difference = function(a, b) {
        return a.filter(function(aElem) {
            return !b.includes(aElem);
        });
    }

    var getGroupMembers = function (groupID, callback) {
        $http.get("/group/members?_id=" + groupID).then(
            function(rep) {
                var groupMembers = rep.data.members ? rep.data.members : [ ];
                callback(groupMembers);
            },
            function(err) {}
        );
    }

    var changePersonsMemberOf = function(groupID, persons, doWhat) {
        for (var i in persons) {
            var payload = { _id: persons[i], memberOf: groupID, action: doWhat };
            $http.put("/person/memberof", payload);
        }
    }

    // db CUD
    var changeGroup = function(data) {
        // update persons
        getGroupMembers(data._id, function(groupMembersThen) {
            var groupMembersNow = data.members ? data.members : [];

            var toDeleteFrom = difference(groupMembersThen, groupMembersNow);
            var toAddTo = difference(groupMembersNow, groupMembersThen);

            changePersonsMemberOf(data._id, toDeleteFrom, 'remove');
            changePersonsMemberOf(data._id, toAddTo, 'add');
        });
        
        // update group
        $http.put("/group", data).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    }

    var deleteGroup = function(id) {
        getGroupMembers(id, function(formerGroupMembers) {
            changePersonsMemberOf(id, formerGroupMembers, 'remove');
        });

        $http.delete("/group?_id=" + id).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane usunięte');
            },
            function(err) {}
        );
    }

    var insertGroup = function(data) {
        $http.post("/group", data).then(
            function(rep) {
                var newMembers = data.members ? data.members : [];
                changePersonsMemberOf(rep.data._id, newMembers, 'add');
                
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    }

}]);