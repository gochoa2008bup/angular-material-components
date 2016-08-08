(function() {

  angular
    .module('angularMaterialComponents.login')
    .controller('LoginController', [
      'LoginService',
      '$state',
      '$location',
      '$scope',
      '$compile',
      'lodash',
      LoginController
    ]);

  function LoginController(
    LoginService,
    $state,
    $location,
    $scope,
    $compile,
    _
  ) {
    console.log('LoginController initialized');

    var ctrl = this;

    ctrl.labels = {
      USER: gettext('User'),
      PASSWORD: gettext('Password'),
      RESET_TITLE: gettext('Password Reset'),
      RESET_EMAIL_INSTRUCT: gettext('We will send you an email with the instructions to complete your password reset.'),
      BACK_TO_LOGIN: gettext('Back to login'),
      PASSWORD_TWICE: gettext('Please enter your new password twice so we can verify you typed it in correctly.'),
      SUCCES_RESET_TITLE: gettext('Password reset complete'),
      SUCCES_RESET_MESSAGE: gettext('Your password has been set. You may go ahead and log in now.'),
      UNSUCCES_RESET_TITLE: gettext('Password reset unsuccessful'),
      UNSUCCES_RESET_MESSAGE: gettext('This password reset link is invalid, possibly because it has already been used. Please request a new password reset.'),
    }

    ctrl.username = '';
    ctrl.password = '';
    ctrl.isLoggedIn = false;
    ctrl.loading = true;
    ctrl.authErrors = {};

    if ($state.current.name == 'home.resetPassword' && LoginService.userLoggedIn) {
      $location.path('');
    } else if($state.current.name == 'home.resetPassword') {
      LoginService.getResetPasswordForm($state.params)
      .then(function(response){
        if(response.invalid_link){
          ctrl.unsuccesPasswordReset = true;
          ctrl.resetPasswordEmailForm = response.form;
        } else {
          ctrl.resetPasswordForm = response;
        }
      })
      .finally(function(){
        ctrl.loading = false;
      });
    } else {
      getLoginForm();
    }

    function getLoginForm(){
      return LoginService.getLoginForm()
      .then(function(loginForm){
        ctrl.loginForm = loginForm;
      })
      .finally(function(){
        ctrl.loading = false;
      });
    }

    ctrl.onSubmit = function(e) {
      ctrl.authErrors = {};
      ctrl.loading = true;

      LoginService.login(ctrl.loginForm.data)
      .then(function(isLoggedIn){
        $scope.fdpOnLogin();
        ctrl.isLoggedIn = isLoggedIn;
      })
      .catch(function(formWithErrors) {
        ctrl.loginForm = formWithErrors;
      })
      .finally(function(){
        ctrl.loading = false;
      });
    };

    ctrl.openForgotPass = function(){
      LoginService.getForgotPasswordEmailForm()
        .then(function(form){
          ctrl.resetPasswordEmailForm = form;
        })
        .finally(function(){
          ctrl.loading = false;
        });
    }

    ctrl.onResetPasswordSendEmail = function() {
      ctrl.loading = true;
      ctrl.unsuccesPasswordReset = false;
      LoginService.resetPasswordSendEmail(ctrl.resetPasswordEmailForm.data)
        .then(function(form){
          if(form.errors){
            ctrl.resetPasswordEmailForm = form;
          } else {
            ctrl.resetPasswordEmailSentMessage = form.message;
          }
        })
        .finally(function(){
          ctrl.loading = false;
        });
    }

    ctrl.onResetPassword = function(){
      ctrl.loading = true;
      LoginService.postResetPasswordForm(_.extend({}, ctrl.resetPasswordForm.data, $state.params))
      .then(function(response){
        // Si viene SetPasswordForm nuevamente e sporque no validó
        if(response.errors && response.name == 'SetPasswordForm'){
          ctrl.resetPasswordForm = response;
        } else if(response.invalid_link){ // El link ya se usó, o caducó
          ctrl.unsuccesPasswordReset = true;
        } else {
          ctrl.resetPasswordForm = null; // No hubo errores en el form y el link era valido. El backend devuelve login form
          ctrl.succesPasswordReset = true;
          ctrl.loginForm = response;

          // Ahora que termino el proceso de reset, se puede limpiar la url
          // para no ver mas los tokens, etc.
          $location.path('');
        }
      })
      .finally(function(){
        ctrl.loading = false;
      });
    }

    ctrl.showLoginForm = function(){
      return ctrl.loginForm &&! ctrl.loading && !ctrl.resetPasswordForm && !ctrl.resetPasswordEmailForm;
    }

    ctrl.showResetPasswordEmailForm = function(){
      return ctrl.resetPasswordEmailForm && !ctrl.loading && !ctrl.resetPasswordEmailSentMessage;
    }

    ctrl.backToLogin = function(){
      ctrl.resetPasswordEmailForm = null;
      ctrl.succesPasswordReset = null;
      ctrl.resetPasswordForm = null;
      $location.path('');
      if(ctrl.unsuccesPasswordReset){
        getLoginForm().then(function(){
          ctrl.unsuccesPasswordReset = null;
        });
      } else {
        getLoginForm();
      }
    }

    ctrl.showResetPasswordForm = function(){
      return !!ctrl.resetPasswordForm && !ctrl.loading;
    }

  }

})();
