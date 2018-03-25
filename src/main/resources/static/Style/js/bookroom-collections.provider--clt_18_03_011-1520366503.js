"use strict";

angular.module('kids.bookroom').provider('bookroomCollections', [
    function bookroomCollectionsProvider() {
        var provider = this;

        provider.bookroomCollections = [];
        provider.extend = extend;

        provider.constants = {
            API_BOOKLIST: '/api/student-bookroom/processed-booklist'
        };

        provider.$get = ['$http', 'Resource', 'resourceUtil', function ($http, Resource, resourceUtil) {

            var getCollectionData = function () {
                return provider.bookroomCollections;
            };

            var getBooklistWithActivityInfo = function (collectionId, level) {
                var params = {
                    collectionId: collectionId
                };
                if (level) {
                    params.level = level;
                }
                return $http.get(provider.constants.API_BOOKLIST, {
                    params: params
                }).then(function (response) {
                    return response.data;
                });
            };

            var getBooklistResources = function (collectionId, level) {
                return getBooklistWithActivityInfo(collectionId, level).then(
                    function (booklistWithActivityInfo) {
                        return resourceUtil.mapConstructor(
                            booklistWithActivityInfo, Resource
                        );
                    }
                );
            };

            return {
                getCollectionData : getCollectionData,
                getBooklistWithActivityInfo : getBooklistWithActivityInfo,
                getBooklistResources : getBooklistResources
            }
        }];

        function extend(bookroomCollections) {
            bookroomCollections.forEach(function (collection) {
                provider.bookroomCollections.push(collection);
            });
        }
    }]
);
