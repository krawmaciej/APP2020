var app = angular.module('app2020');

app.controller('GroupsCtrl', ['$scope', '$http', '$uibModal', 'common', function($scope, $http, $uibModal, common) {
    var ctrl = this;

    ctrl.groups = [];
    ctrl.groupsCount = 0;
    ctrl.groupsFiltered = 0;
    ctrl.limit = 10;
    ctrl.search = '';

    ctrl.loadGroups = function(callback = null) {
        $http.get("/groups?limit=" + ctrl.limit + "&search=" + ctrl.search).then(
            function(rep) {
                ctrl.groups = rep.data.data;

                console.log('ctrl.groups=' + ctrl.groups);
                //stupido to change?
                /*
                for(var group in ctrl.groups) {
                    group.numberOfMembers = group.persons.length;
                    console.log('group=' + group);
                    console.log('group.persons=' + group.persons);
                    console.log('group.persons.length=' + group.persons.length);
                }
                */

                ctrl.groupsCount = rep.data.count;
                ctrl.groupsFiltered = rep.data.filtered;
                if(callback) callback();
            },
            function(err) {
                ctrl.groups = [];
                ctrl.groupsCount = 0;
                ctrl.groupsFiltered = 0;                
            }
        );
    };

    ctrl.increaseLimit = function() {
        ctrl.limit += 5;
        ctrl.loadGroups();
    }

    var editGroup = function(options) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'editGroupDialog.html',
            controller: 'EditGroupCtrl',
            controllerAs: 'ctrl',
            resolve: {
                editGroupOptions: function () {
                    return options;
                }
            }
        });

        modalInstance.result.then(
            function (ret) {
                switch(ret) {
                    case 'save':
                        if(options.data._id) {
                            changeGroup(options.data);
                        } else {
                            insertGroup(options.data);
                        }
                        break;
                    case 'delete':
                        deleteGroup(options.data._id);
                        break;
                }
            },
            function (ret) {}
        );

    };

    ctrl.clickGroup = function(id) {
        $http.get("/group?_id=" + id).then(
            function(rep) {
                var editGroupOptions = { data: rep.data };
                editGroup(editGroupOptions);
            },
            function(err) {}
        );
    };

    ctrl.new = function() {
        var editGroupOptions = { data: {}, noDelete: true };
        editGroup(editGroupOptions);
    };

    ctrl.limitReached = function() {
        return ctrl.groupsFiltered <= ctrl.limit;
    };

    // the first call
    ctrl.loadGroups(function() {});

    var changeGroup = function(data) {
        $http.put("/group", data).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    };

    var deleteGroup = function(id) {
        $http.delete("/group?_id=" + id).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane usunięte');
            },
            function(err) {}
        );
    };

    var insertGroup = function(data) {
        $http.post("/group", data).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    };

}]);