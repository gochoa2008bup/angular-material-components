(function() {
  'use strict';

  angular.module('angularMaterialComponents.formsBuilder')
    .controller('FormsBuilderController', FormsBuilderController);

  function FormsBuilderController($scope, lodash, $timeout) {
    'use strict';
    var vm = this;
    var _ = lodash;

    vm.labels = {
      NOT_FOUND: gettext('Not found')
    }

    vm.formData = $scope.formData;
    vm.removeFieldButton = $scope.removeFieldButton;
    vm.divideFields = $scope.divideFields;
    vm.flexFields = $scope.flexFields;
    vm.flexFieldsSeparator = $scope.flexFieldsSeparator;

    vm.jqDatepickerOptions = {
      changeYear: true
    };

    vm.hasError = function(error){
      console.log($scope, vm.formData);
      return false;
    }

    vm.showErrors = function(buildForm, fieldName, field){
      return buildForm[fieldName].$invalid && buildForm[fieldName].$touched || buildForm.$submitted || vm.formData.typed_errors[fieldName];
    }

    vm.getFieldErrors = function(fieldName, field){
      $scope.buildForm.$setValidity();
      var formField = $scope.buildForm[fieldName];
      if(formField.$touched && !$scope.buildForm.$submitted) {
        return formField.$error;
      }
      var fieldErrros = getFieldErrors(fieldName);
      if(fieldErrros){
        formField.$error = fieldErrros;
      }
      if(lodash.keys(formField.$error.lenght)){
        formField.$setTouched();
      }
      return formField.$error;
    }

    vm.getErrorMessages = function(fieldName){
      var typedErrors = {};
      _.each(vm.formData.typed_errors[fieldName], function(error){
        typedErrors[error.code] = error.message;
      })
      return _.extend({}, typedErrors, vm.formData.fields[fieldName].error_messages);
    }
  
    vm.getAutocompleteItems = function(field){
      if(!field.searchText){
        return [];
      }
      var result = _.filter(field.choices, function(choice){
        return choice.display.toLowerCase().indexOf(field.searchText.toLowerCase()) != -1;
      })
      return result;
    }

    vm.autocompleteSelectedItemChange = function(field, fieldName){
      if(field.selectedItem){
        vm.formData.data[fieldName] = field.selectedItem.value;
      } else {
        vm.formData.data[fieldName] = null;
      }
    }

    function getFieldErrors(fieldName) {
      var errors = {};
      lodash.each(vm.formData.typed_errors[fieldName], function(error){
        errors[error.code] = true
      });
      if(_.keys(errors).length){
        return errors;
      }
      return null;
    }

    angular.forEach(vm.formData.fields, function(field, fieldName) {
      if(field.widget.input_type == 'tags'){
        var dataValue = vm.formData.data[fieldName];
        if(dataValue == null) {
          vm.formData.data[fieldName] = [];
        }
      } else if(field.widget.input_type == 'autocomplete'){
        field.selectedItem = _.find(field.choices, {
          value: vm.formData.data[fieldName]
        })
        $scope.$watch(function(){
          return field.selectedItem;
        }, function(newValue, oldValue){
          if(newValue == null){
            vm.formData.data[fieldName] = null;
          }
        })
      }
    });

  }

})();
