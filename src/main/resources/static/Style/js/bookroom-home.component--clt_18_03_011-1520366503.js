angular.module('kids.bookroom')
    .component('bookroomHome', {
        templateUrl: '/js/angular/bookroom/bookroom-home.template.html',
        controller: 'BookroomHomeController',
        bindings: {}
    })
    .controller('BookroomHomeController', ['FeatureCheck', 'guiConfig', function (FeatureCheck, guiConfig) {
        var ctrl = this;

        ctrl.data = {
            readingRoomFavoriteThemesFeatureEnabled: false,
            favoritesGuiConfigEnabled: false
        };

        ctrl.$onInit = function () {
            ctrl.data.readingRoomFavoriteThemesFeatureEnabled = FeatureCheck.isFeatureEnabled(
                'READING_ROOM_FAVORITE_THEMES'
            );
            ctrl.data.favoritesGuiConfigEnabled = guiConfig.isGuiConfigAreaEnabled(
                'favorites'
            );
        };

    }]);
