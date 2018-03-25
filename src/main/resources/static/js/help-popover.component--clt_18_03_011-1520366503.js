"use strict";

angular.module('shared')

    .component('helpPopover', {
            templateUrl: '/shared/js/angular/ui/help-popover.html',
            transclude: true,
            controller: "HelpPopover"
        })
    .controller('HelpPopover', ["$attrs", function($attrs){
        var ctrl = this;
        ctrl.openOnHover = function () {
            return $attrs.openOnHover;
        };
    }]);