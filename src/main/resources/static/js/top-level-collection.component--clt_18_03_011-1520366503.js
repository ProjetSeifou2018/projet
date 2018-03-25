angular.module('kids.bookroom')
    .component('topLevelCollection', {
        templateUrl: '/js/angular/bookroom/top-level-collection.template.html',
        controller: 'TopLevelCollectionController',
        bindings: {
            collection: '<'
        }
    })
    .controller('TopLevelCollectionController', ['BoundedScrollModel', 'bookroomCollections', '_',
        function (BoundedScrollModel, bookroomCollections, _) {
            var ctrl = this;

            ctrl.collection = {
                collection_id: null,
                collection_name: '',
                collection_svg: '',
                default_level: '',
                is_default: false,
                parent_collection_id: null,
                child_collections: [],
                sub_collections: []
            };

            ctrl.$onInit = function () {};

        }
    ]);
