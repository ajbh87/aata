/* global angular */
import aataResources from './aataResources.js';
import aataForm from './aataForm.js';
//import aataCache from './aataCache.js';
import saKnife from './libs/saKnife.js';

const initComponents = (function initComponents(angular) {
  let jqLite = angular.element;

  angular
    .module('components', ['ngResource', 'ngMessages'])
    //.factory('aataCache', aataCache)
    .directive('aataScript', aataScript)
    .directive('aataForm', aataForm)
    .directive('aataResources', aataResources)
    .directive('aataMenu', aataMenu)
    .directive('aataButton', aataButton)
    .directive('aataTransfer', aataTransfer);

  aataTransfer.$inject = ['$document'];
  aataMenu.$inject = ['$document', '$compile', '$templateCache', '$rootScope'];
  aataForm.$inject = ['$http', '$timeout'];
  aataResources.$inject = [
    '$compile',
    '$q',
    '$sce',
    '$resource',
    '$templateCache',
    '$timeout',
    '$document',
    '$rootScope'
  ];

  return 'initComponents';

  function aataMenu($document, $compile, $templateCache, $rootScope) {
    $rootScope.activeLink = window.location.href
      .replace(/(https?:\/\/)/g, '')
      .replace(/\/+$/g, '');
    return {
      link: (scope, element, attrs) => {
        const SELECTOR = attrs.aataMenu,
          MENU = element.find('div'),
          EXPAND = $templateCache.get('expand.html');

        element.addClass('js');
        MENU.detach();
        // List items with submenu
        MENU[0].querySelectorAll(SELECTOR).forEach(listItem => {
          listItem.innerHtml = insertExpand(listItem);
        });
        MENU[0].querySelectorAll('a').forEach(anchorItem => {
          let href = jqLite(anchorItem)
            .attr('href')
            .replace(/(https?:\/\/)/g, '')
            .replace(/\/+$/g, '');
          jqLite(anchorItem).attr(
            'ng-class',
            `{"active": activeLink == "${href}"}`
          );
          anchorItem.outerHtml = $compile(anchorItem)(scope.$new());
        });
        element.append(MENU);

        function insertExpand(item) {
          let subScope = scope.$new();

          subScope.showChildren = false;
          jqLite(item)
            .find('ul')
            .attr('ng-class', `{'is-active': showChildren}`);
          jqLite(item).prepend(EXPAND);

          return $compile(item)(subScope);
        }
      }
    };
  }
  function aataScript() {
    return {
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var s = document.createElement('script');
          var src = elem.attr('src');
          s.type = 'text/javascript';
          if (src !== undefined) {
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
          transferBreak = parseFloat(attr.aataTransferBreak) - 1;
        let transfered = false;
        transfer();
        jqLite(window).on('resize', transfer);
        function transfer() {
          let winSize = saKnife.winSize(),
            o = winSize.documentHeight > winSize.height ? 15 : 0;
          if (winSize.width + o < transferBreak) {
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
    };
  }
  function aataButton() {
    return {
      link: function(scope, elem) {
        elem[0].addEventListener('click', gs);
      }
    };
    function gs() {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          jqLite(this).addClass('animate');
        });
      });
      this.addEventListener('animationend', function() {
        jqLite(this).removeClass('animate');
      });
      this.addEventListener('webkitAnimationEnd', function() {
        jqLite(this).removeClass('animate');
      });
    }
  }
})(angular);
export default initComponents;
