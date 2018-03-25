"use strict";

angular.module('kids.bookroom').provider('guiConfig', [
    function guiConfigProvider() {
        var provider = this;

        // sample gui config maps to show the expected data structures
        provider.guiConfigIdMap = {
            1 : {
                gui_config_id : '1',
                gui_config_area : 'sampleGuiConfigAreaName',
                is_enabled: 'n'
            }
        };
        provider.guiConfigNameMap = {
            sampleGuiConfigAreaName : {
                gui_config_id : '1',
                gui_config_area : 'sampleGuiConfigAreaName',
                is_enabled: 'n'
            }
        };

        provider.extend = extend;

        provider.$get = function () {
            return {
                guiConfigIdMap : provider.guiConfigIdMap,
                guiConfigNameMap : provider.guiConfigNameMap,
                isGuiConfigAreaEnabled : isGuiConfigAreaEnabled
            };
        };

        function extend(guiConfigIdMap) {
            angular.extend(provider.guiConfigIdMap, guiConfigIdMap);
            var guiConfigIds = Object.keys(provider.guiConfigIdMap);
            var guiConfigNameMap = {};
            guiConfigIds.forEach(function (id) {
                var currentGuiConfig = provider.guiConfigIdMap[id];
                guiConfigNameMap[currentGuiConfig.gui_config_area] = currentGuiConfig;
            });
            angular.extend(provider.guiConfigNameMap, guiConfigNameMap);
        }

        function isGuiConfigAreaEnabled(guiConfigAreaName) {
            if (provider.guiConfigNameMap[guiConfigAreaName] === undefined) {
                throw new Error('Unknown gui config area name: ' + guiConfigAreaName);
            }
            return provider.guiConfigNameMap[guiConfigAreaName].is_enabled === 'y';
        }
    }]
);
