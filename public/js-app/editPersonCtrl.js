var app = angular.module('app2020');

app.controller('EditPersonCtrl', ['$http', '$uibModalInstance', 'editPersonOptions', 'common', function($http, $uibModalInstance, editPersonOptions, common) {
    var ctrl = this;

    ctrl.opt = editPersonOptions;

    ctrl.groups = [];
    $http.get('/groups').then(
        function(rep) { ctrl.groups = rep.data.data; },
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