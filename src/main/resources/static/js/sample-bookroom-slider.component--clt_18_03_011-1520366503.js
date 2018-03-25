'use strict';

angular.module('kids.bookroom')
    .component('sampleBookroomSlider', {
        templateUrl: '/js/angular/bookroom/bookroom-slide-pane/sample-bookroom-slider.template.html',
        controller: 'SampleBookroomSlider',
        bindings: {
            itemWidth : '@',
            itemHeight : '@',
            viewportItems : '@'
        }
    })
    .controller('SampleBookroomSlider', ['BoundedScrollModel', function (BoundedScrollModel) {
        var ctrl = this;

        ctrl.sampleDataItems = [
            { color: 'red'},
            { color: 'azalea'},
            { color: 'viridian'},
            { color: 'yellow'},
            { color: 'green'},
            { color: 'purple'},
            { color: 'grey'},
            { color: 'lightblue'},
            { color: 'goldenrod'},
            { color: 'cerulean'}
        ];

        ctrl.$onInit = function () {
            initSlidePane();
        };

        var initSlidePane = function () {
            // Create a scroll model to pass into the slide pane in the template.
            // We are using parseInt() since the bindings are taken in as strings.
            ctrl.scrollModel = new BoundedScrollModel({
                itemWidth: parseInt(ctrl.itemWidth),
                viewportWidth: parseInt(ctrl.viewportItems) * parseInt(ctrl.itemWidth),
                stepSize: 7,
                itemsToScroll: parseInt(ctrl.viewportItems),
                displayItemBuffer: parseInt(ctrl.viewportItems)
            });
            // set the array data the scrollModel will be rendering in its viewport
            ctrl.scrollModel.setItems(ctrl.sampleDataItems);
        };
    }]);
