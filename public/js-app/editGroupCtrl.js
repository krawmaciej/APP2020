var app = angular.module('app2020');

app.controller('EditGroupCtrl', ['$http', '$uibModalInstance', 'editGroupOptions', 'common', function($http, $uibModalInstance, editGroupOptions, common) {
    var ctrl = this;

    ctrl.opt = editGroupOptions;

    ctrl.persons = [];
    $http.get('/persons').then(
        function(rep) { ctrl.persons = rep.data.data; },
        function(err) {}
    );

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