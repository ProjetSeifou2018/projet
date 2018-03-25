'use strict';
angular.module('kids.bookroom')
    .component('bookroomCollections', {
        templateUrl: '/js/angular/bookroom/bookroom-collections.template.html',
        controller: 'BookroomCollections',
        bindings: {
            itemWidth: '@',
            itemHeight: '@',
            viewportItems: '@'
        }
    })
    .controller('BookroomCollections', ['bookroomCollections', 'BoundedScrollModel',
        function (bookroomCollections, BoundedScrollModel) {
            var ctrl = this;

            ctrl.data = {
                bookroomCollections: {
                    all: []
                }
            };

            ctrl.$onInit = function () {
                ctrl.data.bookroomCollections.all = bookroomCollections.getCollectionData();
                console.log(ctrl.data.bookroomCollections.all);
                initCollectionsSlidePane();
            };

            var initCollectionsSlidePane = function () {
                /* the width of this slide-pane-viewport MUST match the
                 expected width of each viewport element x number of
                 elements shown */
                ctrl.scrollModel = new BoundedScrollModel({
                    itemWidth: parseInt(ctrl.itemWidth),
                    viewportWidth: parseInt(ctrl.viewportItems)*parseInt(ctrl.itemWidth),
                    stepSize: 21,
                    itemsToScroll: parseInt(ctrl.viewportItems),
                    displayItemBuffer: parseInt(ctrl.viewportItems)
                });
                ctrl.scrollModel.setItems(ctrl.data.bookroomCollections.all)
            };

        }
    ]);
