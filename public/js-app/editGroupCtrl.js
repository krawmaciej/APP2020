var app = angular.module('app2020');

app.controller('EditGroupCtrl', ['$http', '$uibModalInstance', 'editGroupOptions', 'common', function($http, $uibModalInstance, editGroupOptions, common) {
    var ctrl = this;

    ctrl.opt = editGroupOptions;
    ctrl.personsTotal = 0;
    ctrl.limit = 10;
    ctrl.persons = [];

    ctrl.loadPersons = function(callback = null) {
        $http.get('/persons?limit=' + ctrl.limit).then(
            function(rep) { 
                document.getElementById("czlonkowie").size = ctrl.limit;
                ctrl.persons = rep.data.data;
                ctrl.personsTotal = rep.data.count;
            },
            function(err) {}
        );
    }

    ctrl.increaseLimit = function() {
        ctrl.limit += 5;
        ctrl.loadPersons();
    }

    ctrl.limitReached = function() {
        return ctrl.personsTotal <= ctrl.limit;
    }

    ctrl.loadPersons();

    ctrl.save = function() { $uibModalInstance.close('save'); };
    ctrl.delete = function() {
        if (ctrl.opt.data.members && ctrl.opt.data.members.length) {
            common.confirm({ title: 'Uwaga!', body: 'Grupa zawiera członków, czy na pewno chcesz ją skasować?', noOk: false, noCancel: false }, function(answer) {
                if(answer) {
                    $uibModalInstance.close('delete');
                }
            });
        } else {
            $uibModalInstance.close('delete');
        }

    }
    ctrl.cancel = function() { $uibModalInstance.dismiss('cancel'); };

}]);