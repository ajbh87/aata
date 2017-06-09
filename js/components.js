import aataResources from './aataResources.js';
import aataForm from './aataForm.js';

const initComponents = (function initComponents(angular) {
    let jqLite = angular.element;

    angular.module('components', ['ngResource', 'ngMessages'])
    .directive('aataScript', aataScript)
    .directive('aataForm', aataForm)
    .directive('aataResources', aataResources)
    .directive('aataMenu', ['$document', '$compile', '$templateCache',
        function ($document, $compile, $templateCache) {
        return {
            link: (scope, element, attrs) => {
                const selector = attrs.aataMenu,
                    menu = element.find('div');
                let items, index = 0;
                menu.detach();
                items = menu[0].querySelectorAll(selector);
                element.addClass('js');
                for (index = 0; index < items.length; index++) {
                    items[index].innerHtml = insertExpand(items[index]);
                }
                element.append(menu);

                function insertExpand(item) {
                    let subScope = scope.$new(),
                        compiled = '';
                    const expand =  $templateCache.get('expand.html');;
                    const ulChildren = jqLite(item).find('ul');
                    subScope.showChildren = false;
                    ulChildren.attr('ng-class', "{'is-active': showChildren}");
                    jqLite(item).prepend(expand);
                    return $compile(item)(subScope);
                }
            }
        };
    }]);
    aataForm.$inject = ['$http', '$timeout'];
    aataResources.$inject = [ '$compile', '$q', '$sce', '$resource', '$templateCache', '$timeout', '$document' ];

    return;

    function aataScript() {
        return {
          //restrict: 'E',
          scope: false,
          link: function(scope, elem, attr) {
            if (attr.type==='text/javascript-lazy') 
            {
              var s = document.createElement("script");
              s.type = "text/javascript";                
              var src = elem.attr('src');
              if(src!==undefined)
              {
                  s.src = src;
              }
              else
              {
                  var code = elem.text();
                  s.text = code;
              }
              document.head.appendChild(s);
              elem.remove();
            }
          }
        };
      }
    

})(angular);
export default initComponents;