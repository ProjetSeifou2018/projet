"use strict";

angular.module('kids.bookroom').provider('loggedInInfo', [
    function loggedInInfoProvider() {
        var provider = this;

        provider.loggedInInfo = {
            member_id: null,
            student_id: null,
            student_accounts: {
                rk: null,
                waz: null,
                saz: null,
                headsprout: null,
                tr: null
            }
        };
        provider.extend = extend;

        provider.$get = function () {
            return provider.loggedInInfo;
        };

        function extend(loggedInInfo) {
            angular.extend(provider.loggedInInfo, loggedInInfo)
        }
    }]
);
