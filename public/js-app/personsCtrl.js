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
    };

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
            function (ret) {}
        );

    };

    ctrl.clickPerson = function(id) {
        $http.get("/person?_id=" + id).then(
            function(rep) {
                //var editPersonOptions = { data: rep.data };
                editPerson( { data: rep.data } );
            },
            function(err) {}
        );
    };

    ctrl.new = function() {
        //var editPersonOptions = { data: {}, noDelete: true };
        editPerson( { data: {}, noDelete: true } );
    };

    ctrl.limitReached = function() {
        return ctrl.personsFiltered <= ctrl.limit;
    };

    // the first call
    ctrl.loadPersons(function() {});

    var changePerson = function(data) {
        $http.put("/person", data).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    };

    var deletePerson = function(id) {
        $http.delete("/person?_id=" + id).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane usunięte');
            },
            function(err) {}
        );
    };

    var insertPerson = function(data) {
        $http.post("/person", data).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    };

}]);