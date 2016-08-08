(function() {

  angular
    .module('angularMaterialComponents.profile')
    .controller('ProfileController', [
      'ProfileService',
      '$mdToast',
      '$timeout',
      '$scope',
      ProfileController
    ]);

  function ProfileController(ProfileService, $mdToast, $timeout, $scope) {
    var vm = this;

    vm.labels = {
      TITLE: gettext('Update Profile'),
      UPDATE: gettext('Update profile'),
      UPDATE_PASSWORD: gettext('Change password'),
      TITLE_PASSWORD: gettext('Change password'),
      PROFILE_UPDATE_SUCCESS: gettext('Profile succesfully updated'),
      PASS_CHANGE_SUCCES: gettext('Password succesfully changed')
    };

    vm.loading = true;
    vm.formData = {};

    function parseAndSetForms(profileData) {
      vm.user = profileData.profile_form;
      vm.formData.profileForm = profileData.profile_form;
      vm.formData.passwordForm = profileData.password_form;
    }

    function parseAndSetProfileForm(profileForm) {
      vm.user = profileForm;
      vm.formData.profileForm = profileForm;
    }

    function stopLoading() {
      vm.loading = false;
      var aux = vm.formData.profileForm;
      var aux_passw = vm.formData.passwordForm;
      vm.formData.profileForm = null;
      vm.formData.passwordForm = null;
      $timeout(function(){
          vm.formData.profileForm = aux;
          vm.formData.passwordForm = aux_passw;
          $scope.$apply();
      })
    }

    ProfileService.getProfile()
      .then(parseAndSetForms)
      .catch(function() {
        console.log("Error al obtener los datos de profile.")
      })
      .finally(stopLoading);

      vm.onSubmit = function(e) {
        vm.loading = true;
        var profile_serialized = {};
        angular.copy(vm.user, profile_serialized);
        profile_serialized.birthday = vm.user.birthday ? moment(vm.user.birthday).format('YYYY-MM-DD') : undefined;
        ProfileService.saveProfile(vm.formData.profileForm.data)
          .then(parseAndSetProfileForm)
          .then(function() {
            $mdToast.show(
              $mdToast.simple()
              .content(vm.labels.PROFILE_UPDATE_SUCCESS)
              .hideDelay(2000)
              .position('bottom right')
            );

            setInterval(function(){
              window.location.reload();
            }, 1000);

          })
          .catch(function(formWithErrors) {
            vm.formData.profileForm = formWithErrors;
          })
          .finally(stopLoading);
      };

      vm.onSubmitChangePassword = function(){
        vm.loading = true;
        ProfileService.postChangePassword(vm.formData.passwordForm.data)
        .then(function(passwordForm){
          vm.formData.passwordForm = passwordForm;
          $mdToast.show(
            $mdToast.simple()
            .content(vm.labels.PASS_CHANGE_SUCCES)
            .hideDelay(2000)
            .position('bottom right')
          );
        })
        .catch(function(formWithErrors){
          vm.formData.passwordForm = formWithErrors;
        })
        .finally(stopLoading)
      }
  }

})();
