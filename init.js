require('./style.scss');
import angular from './node_modules/angular/index.js';
import './node_modules/angular-resource/index.js';
import './node_modules/angular-messages/index.js';
import './js/components.js';

angular.module('aata', ['components']).controller('MenuController', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    $scope.hideMenu = true;
    $scope.menuToggle = function(show) {
      let action = show == null ? $scope.hideMenu : show;

      if (action) {
        $scope.hideMenu = false;
      } else {
        $timeout(() => {
          $scope.hideMenu = true;
        }, 250);
      }
      $scope.showMenu = action;
    };
  }
]);
