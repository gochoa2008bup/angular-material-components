(function() {
    'use strict';

    angular
        .module('angularMaterialComponents.login')
        .directive('fdpLogin', fdpLogin);

    function fdpLogin() {
        return {
            restrict: 'AE',
            templateUrl: 'app/components/Login/Login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            scope: {
                fdpOnLogin: '&',
                fdpOnLogout: '&'
            }
        };
    }
})();