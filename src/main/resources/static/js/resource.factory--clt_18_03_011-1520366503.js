(function() {
    'use strict';

    angular.module('resource')

        .factory('Resource', ['resourceUtil', 'ResourceDelivery',
            function(resourceUtil, ResourceDelivery) {

                function Resource (data) {
                    this.resourceId = data.resource_id;
                    this.title      = data.title;
                    this.image      = data.image;
                    this.decoration = data.decoration;
                    this.deliveries = resourceUtil.orderDeliveries(
                        resourceUtil.mapConstructor(data.deliveries, ResourceDelivery)
                    );
                }

                Resource.prototype.getCoverActivityUrl = function() {
                    return this.deliveries[0].getActivityUrl();
                };

                return Resource;

            }]);
}());