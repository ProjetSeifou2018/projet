"use strict";

angular.module('shared')

    .factory('_', ['$window', function ($window) {
            return $window._;
        }])
