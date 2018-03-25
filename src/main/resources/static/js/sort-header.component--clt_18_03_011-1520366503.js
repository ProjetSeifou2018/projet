"use strict";

angular.module('shared')

    .component('sortHeader', {
        bindings: {
            field: '@',
            orderManager: '<'
        },
        controller: 'SortHeader',
        templateUrl: '/shared/js/angular/ui/sort-header.html',
        transclude: true
    })
    .controller('SortHeader', [function SortHeaderController() {
        var ctrl = this;
        ctrl.isOrderBy = function () {
            return ctrl.orderManager.isOrderBy(ctrl.field);
        };
        ctrl.orderBy = function () {
            return ctrl.orderManager.orderBy(ctrl.field);
        };
        ctrl.getReverse = function () {
            return ctrl.orderManager.getReverse();
        }
    }])