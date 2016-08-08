(function(){
"use strict";

angular
    .module('angularMaterialComponents.perfectScrollbar')
    .directive('perfectScrollbar', ['$timeout', perfectScrollbar]);

    function perfectScrollbar($timeout){
      return {
        link: function(scope, element, attrs){
          $timeout(function(){
            $(element)
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
})();
