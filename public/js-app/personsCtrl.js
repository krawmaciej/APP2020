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

    var getPersonMemberOf = function (personID, callback) {
        $http.get("/person/memberof?_id=" + personID).then(
            function(rep) {
                var personMemberOf = rep.data.memberOf ? rep.data.memberOf : [ ];
                callback(personMemberOf);
            },
            function(err) {}
        );
    }

    var changeGroupMembers = function(personID, groups, doWhat) {
        for (var i in groups) {
            var payload = { _id: groups[i], members: personID, action: doWhat };
            $http.put("/group/members", payload);
        }
    }

    // db CUD
    var changePerson = function(data) {
        getPersonMemberOf(data._id, function(personMemberOfThen) {
            var personMemberOfNow = data.memberOf ? data.memberOf : [];
            // get groups to remove/add persons from/to
            var toDeleteFrom = difference(personMemberOfThen, personMemberOfNow);
            var toAddTo = difference(personMemberOfNow, personMemberOfThen);
            // update groups
            changeGroupMembers(data._id, toDeleteFrom, 'remove');
            changeGroupMembers(data._id, toAddTo, 'add');
            // update person
            $http.put("/person", data).then(
                function(rep) {
                    ctrl.loadPersons();
                    common.alert('alert-success', 'Dane zmienione');
                },
                function(err) {}    
            );
        });
        
    }

    var deletePerson = function(id) {
        getPersonMemberOf(id, function(formerPersonMemberOf) {
            // remove person from former groups
            changeGroupMembers(id, formerPersonMemberOf, 'remove');
            // remove group
            $http.delete("/person?_id=" + id).then(
                function(rep) {
                    ctrl.loadPersons();
                    common.alert('alert-success', 'Dane usunięte');
                },
                function(err) {}
            );
        });

    }

    var insertPerson = function(data) {
        $http.post("/person", data).then(
            function(rep) {
                var newMemberOf = data.memberOf ? data.memberOf : [];
                changeGroupMembers(rep.data._id, newMemberOf, 'add');
                
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    }

}]);