var app = angular.module('app2020');

app.controller('EditPersonCtrl', ['$http', '$uibModalInstance', 'editPersonOptions', 'common', function($http, $uibModalInstance, editPersonOptions, common) {
    var ctrl = this;

    ctrl.opt = editPersonOptions;
    ctrl.groupsTotal = 0;
    ctrl.limit = 5;
    ctrl.groups = [];

    $http.get('/groups').then(
        function(rep) { ctrl.groups = rep.data.data; },
        function(err) {}
    );

    ctrl.loadGroups = function(callback = null) {
        $http.get('/groups?limit=' + ctrl.limit).then(
            function(rep) { 
                document.getElementById("grupy").size = ctrl.limit;
                ctrl.groups = rep.data.data;
                ctrl.groupsTotal = rep.data.count;
            },
            function(err) {}
        );
    }

    ctrl.increaseLimit = function() {
        ctrl.limit += 5;
        ctrl.loadGroups();
    }

    ctrl.limitReached = function() {
        return ctrl.groupsTotal <= ctrl.limit;
    }

    ctrl.loadGroups();

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