// common parts
var app = angular.module('app2020', [ 'ngSanitize', 'ngAnimate', 'ngRoute', 'ui.bootstrap' ]);

// router menu
app.constant('routes', [
	{ route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>', roles: [ 0, 1, 2 ] },
	{ route: '/example', templateUrl: 'exampleView.html', controller: 'ExampleCtrl', controllerAs: 'ctrl', menu: 'Przykład', roles: [ 0, 1, 2] },
    { route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Osoby', roles: [ 1, 2 ] },
    { route: '/groups', templateUrl: 'groupsView.html', controller: 'GroupsCtrl', controllerAs: 'ctrl', menu: 'Grupy', roles: [ 1 ] }
]);

// router installation
app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('');
	for(var i in routes) {
        $routeProvider.when(routes[i].route, routes[i]);
	}
	$routeProvider.otherwise({ redirectTo: '/' });
}]);

// common service
app.service('common', [ '$uibModal', function($uibModal) {
    var common = this;
 
    // logged user
    common.user = { login: null, role: 0 };

    common._alert = { text: '', type: 'alert-success' };
    // alert function
    common.alert = function(type, text) {
        common._alert.type = type;
        common._alert.text = text;
        console.log('alert= ' + type + ': ' + text);
    };

    // confirmation dialog function
    common.confirm = function(confirmOptions, callback) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'confirmDialog.html',
            controller: 'ConfirmDialog',
            controllerAs: 'ctrl',
            resolve: {
                confirmOptions: function () {
                    return confirmOptions;
                }
            }
        });

        modalInstance.result.then(
            function () { callback(true); },
            function (ret) { callback(false); }
        );
    };

}]);

// confirmation dialog controller
app.controller('ConfirmDialog', [ '$uibModalInstance', 'confirmOptions', function($uibModalInstance, confirmOptions) {
    var ctrl = this;
    ctrl.opt = confirmOptions;

    ctrl.ok = function () { $uibModalInstance.close(); };
    ctrl.cancel = function () { $uibModalInstance.dismiss('cancel'); };

}]);

// Home controller
app.controller('HomeCtrl', [ function() {
    var ctrl = this;

}]);

// controller for the container of views, alerts and menu
app.controller('ContainerCtrl', ['$http', '$scope', '$location', '$uibModal', 'routes', 'common', function($http, $scope, $location, $uibModal, routes, common) {
    var ctrl = this;

    ctrl.alert = common._alert;

    var rebuildMenu = function() {
        ctrl.menu = [];
        for (var i in routes) {
            if(routes[i].roles.includes(common.role)) {
                ctrl.menu.push({route: routes[i].route, title: routes[i].menu});
            }
        }
        $location.path('/');    
    }

    // get logged user
    $http.get('/login').then(
        function(rep) {
            common.login = rep.data.login;
            common.role = rep.data.role;
            rebuildMenu();
        },
        function(err) { common.login = null; common.role = 0; }
    );

    // on close alert
    ctrl.closeAlert = function() {
        ctrl.alert.text = '';
    };

    // controlling collapsed/not collapsed status
    ctrl.isCollapsed = true;
    $scope.$on('$routeChangeSuccess', function () {
        ctrl.isCollapsed = true;
    });

    // determining which menu position is active
    ctrl.navClass = function(page) {
        return page === $location.path() ? 'active' : '';
    };

    // login/logout icon
    ctrl.loginIcon = function() {
        return common.login ? common.login + '&nbsp;<span class="fa fa-lg fa-sign-out"></span>' : '<span class="fa fa-lg fa-sign-in"></span>';
    };

    // login function
    ctrl.login = function() {
        if(common.login) {
            // log out
            common.confirm({ title: 'Uwaga!', body: 'Czy na pewno chcesz się wylogować?', noOk: false, noCancel: false }, function(answer) {
                if(answer) {
                    $http.delete('/login').then(
                        function(rep) {
                            common.login = null;
                            common.role = 0;
                            rebuildMenu();
                        },
                        function(err) {}
                    );
                }
            });    
        } else {
            // log in
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'loginDialog.html',
                controller: 'LoginCtrl',
                controllerAs: 'ctrl',
            });
    
            modalInstance.result.then(
                function(ret) { 
                    if(ret) {
                        rebuildMenu();
                        common.alert('alert-success', 'Witaj na pokładzie, ' + ret);
                    } else {
                        common.alert('alert-danger', 'Logowanie nieudane');
                    }
                },
                function(err) {}
            );
    
        }
    };

}]);