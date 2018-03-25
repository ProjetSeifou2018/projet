(function() {
    'use strict';

    angular.module('kids.bookroom')

        .component('bookroomSlidePane', {
            templateUrl: '/js/angular/bookroom/bookroom-slide-pane/bookroom-slide-pane.template.html',
            transclude: true,
            controller: 'BookroomSlidePaneController',
            bindings: {
                scrollModel: '<', // use a BoundedScrollModel
                itemWidth: '<',
                itemHeight: '<',
                viewportItems: '<'
            }
        })

        .controller('BookroomSlidePaneController', ['$element', function($element) {
            var ctrl = this;

            ctrl.$postLink = function () {
                ctrl.initViewportItems();
            };

            ctrl.getArrowClasses = function() {
                return {
                    'no-left-arrow': ctrl.scrollModel && !ctrl.scrollModel.canScrollLeft,
                    'no-right-arrow': ctrl.scrollModel && !ctrl.scrollModel.canScrollRight
                }
            };

            ctrl.scrollEvent = function(type, direction) {
                var event = { type: type, direction: direction };
                this.scrollModel.onScrollChange(event);
            };

            ctrl.initViewportItems = function () {
                var $viewport = $element.find('.slide-pane-viewport');
                $viewport.css('width', parseInt(ctrl.viewportItems)*parseInt(ctrl.itemWidth)+'px');
                $viewport.css('height', parseInt(ctrl.itemHeight)+'px');
            };

        }])
})();
