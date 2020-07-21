var app = angular.module('app2020');

app.controller("LoginCtrl", [ '$http', '$uibModalInstance', 'common', function($http, $uibModalInstance, common) {
    var ctrl = this;

    ctrl.login = '';
    ctrl.password = '';

    ctrl.doLogin = function() {

        $http.post('/login', { login: ctrl.login, password: ctrl.password }).then(
            function(rep) {
                common.login = rep.data.login;
                common.role = rep.data.role;
                $uibModalInstance.close(common.login);
            },
            function(err) {
                common.login = null;
                common.role = 0;
                $uibModalInstance.close();
            }
        );
    };

    ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);