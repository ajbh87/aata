import angular from './node_modules/angular/index.js';
import ngResource from './node_modules/angular-resource/index.js';
import ngMessages from './node_modules/angular-messages/index.js';
import initComponents from './js/components.js';

initComponents(angular);
angular.module('aata', [ 'components', 'ngMessages' ])
    .controller('MainController', ['$document', '$scope', function($document, $scope) {

    }]);