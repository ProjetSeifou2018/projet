(function() {
   'use strict';

    angular.module('shared')

        .factory('BoundedScrollModel', ['ScrollModel', function(ScrollModel) {

            function BoundedScrollModel() {
                ScrollModel.apply(this, arguments);
            }

            BoundedScrollModel.prototype = Object.create(ScrollModel.prototype);
            BoundedScrollModel.prototype.constructor = BoundedScrollModel;

            BoundedScrollModel.prototype._setScrollDirection = function(dir) {
                this._scrollDir = dir;

                // this determines how far we will go on a single scroll (right)
                var numItemsToScroll = this._numAllowedToScrollRight();
                this._scrollTarget = this._isScrollingLeft() ? 0 : numItemsToScroll*-this.config.itemWidth;
            };

            BoundedScrollModel.prototype._startScrollLeftFromStopped = function() {
                // TODO: (shafeen) testing multiple items
                var numItemsToScroll = this._numAllowedToScrollLeft();
                this.displayOffset = numItemsToScroll*-this.config.itemWidth;
                this._updateIndex(-1*numItemsToScroll);
                this._startScroll();
            };

            BoundedScrollModel.prototype._updateScroll = function() {
                if(this._state === 'stopped') {
                    this._stopScroll();
                } else {
                    var distToBoundary = Math.abs(this._scrollTarget - this.displayOffset);
                    var step = this.config.stepSize * -this._scrollDir;
                    if(distToBoundary <= Math.abs(step) ) {
                        this._stopScrollAtBoundary();
                    } else {
                        this.displayOffset += step;
                    }
                }
            };

            BoundedScrollModel.prototype._numAllowedToScrollLeft = function () {
                var itemsRemainingLeft = this._itemsRemainingLeft();
                if (itemsRemainingLeft >= this.config.itemsToScroll) {
                    return this.config.itemsToScroll;
                } else {
                    return itemsRemainingLeft;
                }
            };

            BoundedScrollModel.prototype._itemsRemainingLeft = function () {
                return this._start;
            };

            BoundedScrollModel.prototype._numAllowedToScrollRight = function () {
                var itemsRemainingRight = this._itemsRemainingRight();
                if (itemsRemainingRight >= this.config.itemsToScroll) {
                    return this.config.itemsToScroll;
                } else {
                    return itemsRemainingRight;
                }
            };

            BoundedScrollModel.prototype._itemsRemainingRight = function () {
                var currentStartIndex = this._start;
                return (this._items.length-1)-(currentStartIndex+this._displayListItemCapacity()-1);
            };

            return BoundedScrollModel;
        }]);
})();
