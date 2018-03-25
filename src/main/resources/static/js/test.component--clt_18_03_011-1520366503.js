(function() {
    var module = angular.module('kids.bookroom');
    module.component('test', {
        template: '<div>Transcluded:<ng-transclude>Test Component Here</ng-transclude></div>',
        controller: function (loggedInInfo, bookroomCollections, favoritesService) {
            var ctrl = this;
            ctrl.$onInit = function () {
                console.log('test component initialized');
                console.log('loggedInInfo: %o', loggedInInfo);
                console.log('bookroomCollections: %o', bookroomCollections);
                favoritesService.getFavoriteThemesForCurrentStudent().then(function (themes) {
                    console.log('favoriteThemes: %o', themes);
                });
            };
        },
        bindings: {
            text: '@'
        },
        transclude: true
    });
}());
