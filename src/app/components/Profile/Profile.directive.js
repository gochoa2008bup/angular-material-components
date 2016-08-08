(function(){
"use strict";

angular
    .module('angularMaterialComponents.profile')
    .directive('fcProfile', ['$timeout', fcProfile]);

    function fcProfile($timeout){
      return {
        templateUrl: 'app/components/Profile/Profile.html',
        controllerAs: 'vm',
        controller: 'ProfileController'
      };
    }

})();
