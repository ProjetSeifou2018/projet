'use strict';

angular.module('kids.bookroom')
    .component('favoriteThemes', {
        templateUrl: '/js/angular/bookroom/favorite-themes.template.html',
        controller: 'FavoriteThemes',
        bindings: {
            itemWidth: '@',
            itemHeight: '@',
            viewportItems: '@'
        }
    })
    .controller('FavoriteThemes', ['favoritesService', 'bookroomCollections', 'BoundedScrollModel',
        function (favoritesService, bookroomCollections, BoundedScrollModel) {
            var ctrl = this;

            ctrl.constants = {
                LEVELED_BOOKS_DISPLAY_NAME: 'Leveled Books'
            };

            ctrl.data = {
                popularThemes: null,
                leveledBooksCollectionId: null
            };

            ctrl.$onInit = function () {
                initLeveledBooksCollectionId();
                initSlidePane();
                console.log('initialized popular themes component');
            };

            var initSlidePane = function () {
                ctrl.scrollModel = new BoundedScrollModel({
                    itemWidth: parseInt(ctrl.itemWidth),
                    viewportWidth: parseInt(ctrl.itemWidth)*parseInt(ctrl.viewportItems),
                    stepSize: 14,
                    itemsToScroll: parseInt(ctrl.viewportItems),
                    displayItemBuffer: parseInt(ctrl.viewportItems)
                });
                favoritesService.getFavoriteThemesForCurrentStudent().then(function (themes) {
                    ctrl.data.popularThemes = themes; // TODO: (shafeen) this might not used anymore
                    ctrl.scrollModel.setItems(themes);
                });
            };

            var initLeveledBooksCollectionId = function () {
                if (!ctrl.data.leveledBooksCollectionId) {
                    bookroomCollections.getCollectionData().some(function (collectionData) {
                        if (collectionData.collection_name === ctrl.constants.LEVELED_BOOKS_DISPLAY_NAME) {
                            ctrl.data.leveledBooksCollectionId = collectionData.collection_id;
                            return true;
                        } else {
                            return false
                        }
                    });
                }
            };

        }
    ]);
