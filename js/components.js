import aataResources from './aataResources.js';
import aataForm from './aataForm.js';
import saKnife from './libs/saKnife.js';

const initComponents = (function initComponents(angular) {
    let jqLite = angular.element;

    angular.module('components', ['ngResource', 'ngMessages'])
        .directive('aataScript', aataScript)
        .directive('aataForm', aataForm)
        .directive('aataResources', aataResources)
        .directive('aataMenu', aataMenu)
        .directive('aataTransfer', aataTransfer);

    aataTransfer.$inject = ['$document'];
    aataMenu.$inject = ['$document', '$compile', '$templateCache'];
    aataForm.$inject = ['$http', '$timeout'];
    aataResources.$inject = [ '$compile', '$q', '$sce', '$resource', '$templateCache', '$timeout', '$document' ];

    return 'initComponents';
    
    function aataMenu($document, $compile, $templateCache) {
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
    }
    function aataScript() {
        return {
            scope: false,
            link: function(scope, elem, attr) {
                if (attr.type==='text/javascript-lazy') 
                {
                    var s = document.createElement("script");
                    var src = elem.attr('src');
                    s.type = "text/javascript";                
                    if(src!==undefined) {
                        s.src = src;
                    } else {
                        var code = elem.text();
                        s.text = code;
                    }
                    document.head.appendChild(s);
                    elem.remove();
                }
            }
        };
    }

    function aataTransfer($document) {
          return {
            scope: false,
            link: function(scope, elem, attr) {
                const selector = attr.aataTransfer,
                    jqEl = jqLite($document[0].querySelector(selector)),
                    dad = elem.parent(),
                    transferBreak = parseFloat(attr.aataTransferBreak);
                let transfered = false;
                transfer();
                jqLite(window).on('resize', transfer);
                function transfer() {
                    let winSize = saKnife.winSize();
                    if (winSize.width < transferBreak) {
                        if (transfered === false) {
                            elem.detach();
                            jqEl.prepend(elem);
                            transfered = true;
                        }
                    } else {
                        if (transfered === true) {
                            elem.detach();
                            dad.append(elem);
                            transfered = false;
                        }
                    }
                }
            }
        }
    }
})(angular);
export default initComponents;