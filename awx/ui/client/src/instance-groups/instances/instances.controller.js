function InstancesController ($scope, $state, $http, models, Instance, strings, Dataset) {
    const { instanceGroup } = models;
    const vm = this || {};
    vm.strings = strings;
    vm.panelTitle = instanceGroup.get('name');
    vm.instances = instanceGroup.get('related.instances.results');
    vm.instance_group_id = instanceGroup.get('id');

    init();

    function init() {
        $scope.list = {
            iterator: 'instance',
            name: 'instances'
        };
        $scope.collection = {
            basepath: 'instances',
            iterator: 'instance'
        };
        $scope[`${$scope.list.iterator}_dataset`] = Dataset.data;
        $scope[$scope.list.name] = $scope[`${$scope.list.iterator}_dataset`].results;
    }

    vm.tab = {
        details: {
            _go: 'instanceGroups.edit',
            _params: { instance_group_id: vm.instance_group_id }
        },
        instances: {
            _active: true,
            _go: 'instanceGroups.instances',
            _params: { instance_group_id: vm.instance_group_id }
        },
        jobs: {
            _go: 'instanceGroups.jobs',
            _params: { instance_group_id: vm.instance_group_id }
        }
    };

    vm.toggle = (toggled) => {
        let instance = _.find(vm.instances, 'id', toggled.id);
        instance.enabled = !instance.enabled;

        let data = {
            "enabled": instance.enabled
        };

        let req = {
            method: 'PUT',
            url: instance.url,
            data
        };

        $http(req).then(vm.onSaveSuccess);
    };

    vm.onSaveSuccess = () => {
        $state.transitionTo($state.current, $state.params, {
            reload: true, location: true, inherit: false, notify: true
        });
    };

    $scope.isActive = function(id) {
        let selected = parseInt($state.params.instance_id);
        return id === selected;
    };
}

InstancesController.$inject = [
    '$scope',
    '$state',
    '$http',
    'resolvedModels',
    'InstanceModel',
    'InstanceGroupsStrings',
    'Dataset'
];

export default InstancesController;
