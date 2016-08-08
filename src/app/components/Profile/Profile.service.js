(function() {
  'use strict';

  angular.module('angularMaterialComponents.profile')
    .service('ProfileService', [
      '$q',
      '$http',
      '$localStorage',
      'ProfileConfig',
      ProfileService
    ]);

  function ProfileService(
    $q,
    $http,
    $localStorage,
    ProfileConfig
  ) {

    var Service = {
      getProfile: function() {
        return $http({
          method: 'GET',
          url: ProfileConfig.urls.getProfile
        }).then(function successCallback(response) {
          Service.profile = response.data.profile_form;
          $localStorage.userProfile = response.data.profile_form;
          return response.data;
        });
      },

      saveProfile: function(user) {
        return $http({
          method: 'PUT',
          url: ProfileConfig.urls.saveProfile,
          data: user
        }).then(function successCallback(response) {
          Service.profile = response.data;
          $localStorage.userProfile = response.data;
          return Service.profile;
        })
        .catch(function(response){
          var form = JSON.parse(response.data.error).form;
          throw form;
        });
      },

      postChangePassword: function(data){
        return $http({
          method: 'PUT',
          url: ProfileConfig.urls.postChangePassword,
          data: data
        }).then(function successCallback(response) {
          return response.data;
        })
        .catch(function(response){
          var form = JSON.parse(response.data.error).form;
          throw form;
        });
      }
    };

    return Service;
  }
})();
