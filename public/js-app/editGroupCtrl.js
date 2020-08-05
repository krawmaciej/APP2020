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
        common.confirm({ title: 'Uwaga!', body: 'Czy na pewno chcesz skasować ten rekord?', noOk: false, noCancel: false }, function(answer) {
            if(answer) {
                $uibModalInstance.close('delete');
            }
        });
    }
    ctrl.cancel = function() { $uibModalInstance.dismiss('cancel'); };

}]);