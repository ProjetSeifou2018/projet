(function() {
    'use strict';

    angular.module('shared')

        .component('slidePaneButton', {
            templateUrl: '/shared/js/angular/ui/slide-pane/slide-pane-button.html',
            controller: 'SlidePaneButtonController',
            bindings: {
                src: '@',
                onChange: '&'
            },
            transclude: true
        })

        .controller('SlidePaneButtonController', [function() {
            var ctrl = this;
            var pressed = false;

            ctrl.startPress = function() {
                if(pressed) return;

                pressed = true;
                ctrl.onChange({ type: 'start' });
            };

            ctrl.stopPress = function() {
                if(!pressed) return;

                pressed = false;
                ctrl.onChange({ type: 'stop' });
            };
        }]);
})();
