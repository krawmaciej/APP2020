var app = angular.module('app2020');

app.controller('PersonsCtrl', ['$scope', '$http', '$uibModal', 'common', function($scope, $http, $uibModal, common) {
    var ctrl = this;

    ctrl.persons = [];
    ctrl.personsCount = 0;
    ctrl.personsFiltered = 0;
    ctrl.limit = 10;
    ctrl.search = '';

    ctrl.loadPersons = function(callback = null) {
        $http.get("/persons?limit=" + ctrl.limit + "&search=" + ctrl.search).then(
            function(rep) {
                ctrl.persons = rep.data.data;
                ctrl.personsCount = rep.data.count;
                ctrl.personsFiltered = rep.data.filtered;
                    
                if(callback) callback();
            },
            function(err) {
                ctrl.persons = [];
                ctrl.personsCount = 0;
                ctrl.personsFiltered = 0;                
            }
        );
    }

    ctrl.increaseLimit = function() {
        ctrl.limit += 5;
        ctrl.loadPersons();
    }

    var editPerson = function(options) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'editPersonDialog.html',
            controller: 'EditPersonCtrl',
            controllerAs: 'ctrl',
            resolve: {
                editPersonOptions: function () {
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
                            changePerson(options.data);
                        } else {
                            insertPerson(options.data);
                        }
                        break;
                    case 'delete':
                        deletePerson(options.data._id);
                        break;
                }
            },
            function (err) {}
        );

    }

    ctrl.clickPerson = function(id) {
        $http.get("/person?_id=" + id).then(
            function(rep) {
                var editPersonOptions = { data: rep.data };
                editPerson(editPersonOptions);
            },
            function(err) {}
        );
    }

    ctrl.new = function() {
        var editPersonOptions = { data: {}, noDelete: true };
        editPerson(editPersonOptions);
    }

    ctrl.limitReached = function() {
        return ctrl.personsFiltered <= ctrl.limit;
    }

    // the first call
    ctrl.loadPersons();

    // db relation helpers
    var difference = function(a, b) {
        return a.filter(function(aElem) {
            return !b.includes(aElem);
        });
    }

    var getGroupMembers = function (groupID, callback) {
        $http.get("/group?_id=" + groupID).then(
            function(rep) {
                var groupMembers = rep.data.members ? rep.data.members : [ ];
                callback(groupID, groupMembers);
            },
            function(err) {}
        );
    }

    var getPersonMemberOf = function (personID, callback) {
        $http.get("/person?_id=" + personID).then(
            function(rep) {
                var personMemberOf = rep.data.memberOf ? rep.data.memberOf : [ ];
                callback(personMemberOf);
            },
            function(err) {}
        );
    }

    var deletePersonFromGroups = function(personID, notMemberOf) {
        for (var i = 0; i < notMemberOf.length; ++i) {
            getGroupMembers(notMemberOf[i], 
                function(groupID, groupMembers) {
                    var index = groupMembers.indexOf(personID);
                    if (index > -1) {
                        groupMembers.splice(index, 1);
                        var groupToModify = { _id: groupID, members: groupMembers };
                        $http.put("/group", groupToModify);
                    }
                }
            );
        }
    }

    var addPersonToGroups = function(personID, memberOf) {
        for (var i = 0; i < memberOf.length; ++i) {
            getGroupMembers(memberOf[i], 
                function(groupID, groupMembers) {
                    if (!groupMembers.includes(personID)) {
                        groupMembers.push(personID);
                        var groupToModify = { _id: groupID, members: groupMembers };
                        $http.put("/group", groupToModify);
                    }
                }
            );
        }
    }

    var changePerson = function(data) {
        // update groups
        getPersonMemberOf(data._id, function(personMemberOf) {
            data.memberOf = data.memberOf ? data.memberOf : [];

            var toDelete = difference(personMemberOf, data.memberOf);
            var toAdd = difference(data.memberOf, personMemberOf);

            deletePersonFromGroups(data._id, toDelete);
            addPersonToGroups(data._id, toAdd);
        });
        
        // update person
        $http.put("/person", data).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    }

    var deletePerson = function(id) {
        getPersonMemberOf(id, function(personMemberOf) {
            deletePersonFromGroups(id, personMemberOf);
        });

        $http.delete("/person?_id=" + id).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane usunięte');
            },
            function(err) {}
        );
    }

    var insertPerson = function(data) {
        $http.post("/person", data).then(
            function(rep) {
                data.memberOf = data.memberOf ? data.memberOf : [];
                addPersonToGroups(rep.data._id, data.memberOf);
                
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    }

}]);