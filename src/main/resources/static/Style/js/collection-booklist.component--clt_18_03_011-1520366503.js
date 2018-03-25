'use strict';
angular.module('kids.bookroom')
    .component('collectionBooklist', {
        templateUrl: '/js/angular/bookroom/collection-booklist.template.html',
        controller: 'CollectionBooklist',
        bindings: {
            collection: '<',
            itemWidth: '@',
            itemHeight: '@',
            viewportItems: '@'
        }
    })
    .controller('CollectionBooklist', ['bookroomCollections', 'BoundedScrollModel',
        function (bookroomCollections, BoundedScrollModel) {
            var ctrl = this;

            ctrl.collection = {
                collection_id: null,
                collection_name: '',
                collection_svg: '',
                default_level: '',
                is_default: false,
                parent_collection_id: null,
                sub_collections: []
            };

            ctrl.data = {
                booklistResources: []
            };

            ctrl.$onInit = function () {
                initCollectionBooklistResources().then(initCollectionsSlidePane);
            };

            var initCollectionBooklistResources = function () {
                var collectionId = ctrl.collection.collection_id;
                return bookroomCollections.getBooklistResources(collectionId)
                    .then(function (booklistResources) {
                        ctrl.data.booklistResources = booklistResources;
                        console.log("Initialized '%s' collection booklist resources: %o",
                            ctrl.collection.collection_name,
                            ctrl.data.booklistResources
                        );

                    });
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
                ctrl.scrollModel.setItems(ctrl.data.booklistResources);
            };

        }
    ]);
