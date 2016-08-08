(function() {
  'use strict';
  angular.module('angularMaterialComponents.profile')
  .value('ProfileConfig', {
    urls: {
      getProfile: '/api/v1/profile/form/',
      saveProfile: '/api/v1/profile/form/',
      postChangePassword: '/api/v1/profile/password/'
    }
  });
})();
