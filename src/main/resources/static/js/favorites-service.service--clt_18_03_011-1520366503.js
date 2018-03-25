"use strict";

angular.module('kids.bookroom').service('favoritesService', ['$http', 'loggedInInfo', 'Resource', 'resourceUtil',
    function ($http, loggedInInfo, Resource, resourceUtil) {
        var service = this;

        service.constants = {
            API_FAVORITES: '/api/favorite/favorites',
            API_FAVORITE_THEMES: '/api/favorite/themes'
        };

        service.getFavoritesForCurrentStudent = function () {
            if (!loggedInInfo.student_accounts.rk) {
                throw new Error('Logged in student must have access to rk!');
            }
            return $http.get(service.constants.API_FAVORITES)
                        .then(function (response) {
                            return resourceUtil.mapConstructor(response.data, Resource);
                        });
        };

        service.getFavoriteThemesForCurrentStudent = function () {
            if (!loggedInInfo.student_accounts.rk) {
                throw new Error('Logged in student must have access to rk!');
            }
            // TODO: (shafeen) remove the minimumBookTheshold (api will use the default) after testing
            return $http.get(service.constants.API_FAVORITE_THEMES, {
                params: {
                    minimumBookThreshold: 0
                }
            }).then(function (response) {
                return response.data;
            });
        }

    }]
);
