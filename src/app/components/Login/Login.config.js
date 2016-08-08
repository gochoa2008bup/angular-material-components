(function() {
  'use strict';
  angular.module('angularMaterialComponents.profile')
  .value('LoginConfig', {
    urls: {
      getLoginForm: '/api/v1/authentication/login/',

      getForgotPasswordEmailForm: '/api/v1/authentication/reset_password_email_form/',
      resetPasswordSendEmail: '/api/v1/authentication/reset_password_email_form/',

      getResetPasswordForm: '/api/v1/authentication/reset_password_form/',
      postResetPasswordForm: '/api/v1/authentication/reset_password_form/',

      login: '/api/v1/authentication/login/',
      logout: '/api/v1/authentication/logout/'
    }
  })
  .config(['$stateProvider', function($stateProvider){
  	$stateProvider
	  .state('home.resetPassword', {
        url: '/reset-password/:uid/:token',
        controller: 'LoginController',
        controllerAs: 'vm',
        templateUrl: 'app/components/Login/Login.html',
        data: {
          title: 'Reset Password'
        }
      });
  }]);
})();