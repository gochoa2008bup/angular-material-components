(function(){
"use strict";

angular
    .module('angularMaterialComponents.formsBuilder')
    .directive('formsBuilder', ['$timeout', formsBuilder]);

    function formsBuilder($timeout){

      return {
        templateUrl: 'app/components/FormsBuilder/FormsBuilder.html',
        controllerAs: 'vm',
        controller: 'FormsBuilderController',
        scope: {
            formData: '=',
            removeFieldButton: '=',
            onRemovedField: '&',
            flexFields: '=',
            flexFieldsSeparator: '='
        },
        bindToController: {
            onSubmit: '&',
            method: '@'
        },
        transclude: true,
        link: function(scope, element, attrs){
          $timeout(function(){
            $(element).find('.forms-builder-fields-container')
            .css({
              position: 'relative'
            })
            .perfectScrollbar({
              wheelSpeed: 2,
              wheelPropagation: true,
              minScrollbarLength: 20
            });
          })
        }
      };
    }


angular
    .module('angularMaterialComponents.formsBuilder')
    .directive('validableChips', validableChips);

    function validableChips($timeout){
        return {
            link: function($scope, element) {
                $timeout(function(){                
                    $(element).find('.md-errors-spacer').detach().appendTo(element);
                    $(element).find('label').remove();
                })
            }
        }
    }

})();
