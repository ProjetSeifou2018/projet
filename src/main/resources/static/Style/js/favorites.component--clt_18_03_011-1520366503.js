(function(){
    'use strict';
    var module = angular.module('kids.bookroom');
    module.component('favorites', {
        templateUrl: '/js/angular/bookroom/favorites.template.html',
        controller: 'Favorites',
        bindings: {
            itemWidth: '@',
            itemHeight: '@',
            viewportItems: '@'
        }
    });
    module.controller('Favorites', ['favoritesService', 'BoundedScrollModel', '_',
        function(favoritesService, BoundedScrollModel, _) {
            var ctrl = this;

            ctrl.data = {
                favorites: null,
                hasFavorites: false
            };

            ctrl.$onInit = function () {
                initSlidePane();
            };

            var initSlidePane = function() {
                ctrl.scrollModel = new BoundedScrollModel({
                    itemWidth: parseInt(ctrl.itemWidth),
                    viewportWidth: parseInt(ctrl.itemWidth)*parseInt(ctrl.viewportItems),
                    stepSize: 21,
                    itemsToScroll: 4,
                    displayItemBuffer: 4
                });

                favoritesService.getFavoritesForCurrentStudent().then(function (favorites) {
                    if (!_.isEmpty(favorites)) {
                        ctrl.data.hasFavorites = true;
                        ctrl.data.favorites = favorites;
                        ctrl.scrollModel.setItems(favorites);
                    }
                });
            };
    }]);
})();
