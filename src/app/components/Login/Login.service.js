(function() {
  'use strict';

  angular.module('angularMaterialComponents.login')
    .service('LoginService', [
      '$q',
      '$http',
      '$rootScope',
      '$localStorage',
      '$timeout',
      '$interval',
      'moment',
      'ProfileService',
      'LoginConfig',
      LoginService
    ]);

  function LoginService(
    $q,
    $http,
    $rootScope,
    $localStorage,
    $timeout,
    $interval,
    moment,
    ProfileService,
    LoginConfig
  ) {

    function watchSession(newVal, oldVal) {
      Service.userLoggedIn = !!$localStorage.userData;
      Service.userData = $localStorage.userData;
      $rootScope.$broadcast(Service.userLoggedIn ? 'LoginService.userLoggedIn' : 'LoginService.userLoggedOut');
    }

    $rootScope.$watch(function() {
      return $localStorage.userData; 
    }, watchSession);

    var Service = {
      userLoggedIn: !!$localStorage.userData,
      userData: $localStorage.userData,

      userIsLoggedIn: function() {
        return $q.when(Service.userLoggedIn);
      },

      getLoginForm: function(){
        return $http({
          method: 'GET',
          url: LoginConfig.urls.getLoginForm,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(response){
          return response.data;
        });
      },

      getResetPasswordForm: function(params){
        return $http({
          method: 'GET',
          url: LoginConfig.urls.getResetPasswordForm,
          headers: {
            'Content-Type': 'application/json'
          },
          params: params
        }).then(function(response){
          return response.data;
        });
      },

      postResetPasswordForm: function(data){
        return $http({
          method: 'POST',
          url: LoginConfig.urls.postResetPasswordForm,
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        }).then(function(response){
          return response.data;
        });
      },

      getForgotPasswordForm: function(){
        return $http({
          method: 'GET',
          url: LoginConfig.urls.getForgotPasswordForm,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(response){
          return response.data;
        });
      },

      getForgotPasswordEmailForm: function(){
        return $http({
          method: 'GET',
          url: LoginConfig.urls.getForgotPasswordEmailForm,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(response){
          return response.data;
        });
      },

      resetPasswordSendEmail: function(data){
        return $http({
          method: 'POST',
          url: LoginConfig.urls.resetPasswordSendEmail,
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function(errorResponse){
          throw JSON.parse(errorResponse.data.error).form;
        });
      },

      login: function(loginData) {
        return $http({
          method: 'POST',
          url: LoginConfig.urls.login,
          headers: {
            'Content-Type': 'application/json'
          },
          data: loginData
        })
        .then(function (response) {
          Service.userLoggedIn = true;
          $localStorage.userData = Service.userData = response.data;
          Service.setAPIKey(response.data.api_key);
          return ProfileService.getProfile().then(function(profile){
            return $q.when(Service.userLoggedIn);
          });
        })
        .catch(function(errorResponse){
          throw JSON.parse(errorResponse.data.error).form;
        });
      },

      logout: function(loginData) {
        return $http({
          method: 'POST',
          url: LoginConfig.urls.logout,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function(){
          Service.userLoggedIn = false;
          $localStorage.userData = Service.userData = null;
          delete $http.defaults.headers.common['Authorization'];
          return $q.when(Service.userLoggedIn);
        });
      },

      setAPIKey: function(apikey) {
        $http.defaults.headers.common['Authorization'] = 'apikey ' + apikey;
      },

      formatDateTime: function(datetime, withoutOffsets) {
        if(withoutOffsets){
          var formatter = moment.utc;
        } else {
          var formatter = moment;
        }
        if($localStorage.userProfile) {
          moment.tz.setDefault($localStorage.userProfile.data.timezone);
          var timeFormat = Service.getTimeFormat($localStorage.userProfile.data.time_format);
          var dateFormat = Service.getDateFormat($localStorage.userProfile.data.date_format);
          return formatter(datetime).format(dateFormat + ' ' +timeFormat);
        }
        return formatter(datetime).format('MM/DD HH:mm A');
      },
      formatDate: function(datetime){
        if($localStorage.userProfile) {
          var dateFormat = Service.getDateFormat($localStorage.userProfile.data.date_format);
          return moment(datetime).format(dateFormat);
        }
        return moment(datetime).format('MM/DD');
      },
      getTimeFormat: function(key) {
        return {
          TIME_FORMAT_1: "HH:mm A",
          TIME_FORMAT_2: "HH:mm"
        }[key]  || 'HH:mm A';
      },
      getDateFormat: function(key) {
        return {
          DATE_FORMAT_2: 'MM/DD',
          DATE_FORMAT_3: 'DD/MM'
        }[key] || 'MM/DD';
      },
      getLanguage: function(){
        if($localStorage.userProfile && $localStorage.userProfile.data) {
          return $localStorage.userProfile.data.lang;
        } else {
          return 'en';
        }
      },
      getUserTimezone: function(){
        if($localStorage.userProfile) {
          var df = $localStorage.userProfile.data.timezone;
          if(df){
            df = df.replace('_', ' ');
          }
          return df;
        }
      }
    };

    if($localStorage.userData) {
      Service.setAPIKey($localStorage.userData.api_key);
    }

    return Service;
  }
})();
