(function () {

    "use strict";

    var checkboxId = 1;

    function getNextCheckboxId() {
        return checkboxId++;
    }

    angular.module('shared')

        .factory('lazCheckboxDirectiveFactory', function kazCheckboxDirectiveFactoryFactory() {

                return checkboxDirectiveFactory;

                function checkboxDirectiveFactory(directive) {
                    return angular.extend({
                        restrict: "E",
                        transclude: true,
                        require: ["?ngModel"],
                        controller: 'LazCheckbox',
                        controllerAs: '$ctrl',
                        scope: {},
                        link: function (scope, elt, attrs, requires) {
                            var ngModel = requires[0];
                            if (ngModel) {
                                ngModel.$render = function () {
                                    scope.$ctrl.checked = ngModel.$viewValue;
                                }
                                scope.$watch('$ctrl.checked', function () {
                                    ngModel.$setViewValue(scope.$ctrl.checked);
                                })
                            }
                        }
                    }, directive)
                }
            }
        )
        .controller('LazCheckbox', ['$attrs', function KazCheckboxCtrl($attrs) {
            var ctrl = this;

            ctrl.checkboxId = 'laz-checkbox-' + getNextCheckboxId();
            ctrl.click = function (event) {
                if (event !== undefined) {
                    event.stopPropagation();
                }
            }
            ctrl.$postLink = function () {
                $attrs.$observe('disabled', function (disabled) {
                    ctrl.disabled = disabled;
                })
            }
        }])
})()
