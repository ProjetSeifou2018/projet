(function () {
    'use strict';

    angular.module('resource')

        .factory('resourceUtil', ['_', function (_) {

            var deliveryOrder = ['listen', 'read', 'quiz', null];

            function orderDeliveries(deliveries) {
                return _.sortBy(deliveries, function(delivery){
                    return _.indexOf(deliveryOrder, delivery.name);
                });
            }

            function mapConstructor(data, constructor) {
                if(_.isEmpty(data)) {
                    return [];
                }
                return _.map(data, function(config) {
                    return new constructor(config);
                })
            }

            return {
                orderDeliveries: orderDeliveries,
                mapConstructor: mapConstructor
            };
        }]);
}());
