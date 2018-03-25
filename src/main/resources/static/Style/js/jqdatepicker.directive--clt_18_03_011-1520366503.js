"use strict";

angular.module('shared')

    .directive('jqdatepicker', function () {
        return {
            restrict: 'A',
            inline: true,
            link: function (scope, element, attrs) {
                element.datepicker({
                    dateFormat: 'mm/dd/yy',
                });
                if( attrs.dateformat){ element.datepicker( "option", "dateFormat", attrs.dateformat); }
                if( attrs.mindate){ element.datepicker( "option", "minDate", attrs.mindate); }
                $j('#ui-datepicker-div').on('mousedown', stopPropagation);
            },
            controller: function () {
                var ctrl = this;
                ctrl.$onDestroy = function () {
                    $j('#ui-datepicker-div').off('mousedown', stopPropagation);
                }
            }
        };

        function stopPropagation(e) {
            e.stopPropagation();
        };
    })
