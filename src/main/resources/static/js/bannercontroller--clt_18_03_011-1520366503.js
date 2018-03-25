/*  BannerController (requires Prototype javascript framework, scriptaculous optional for effects)
 *  Jeff Weakland
 *  05/17/2012
 *  Version 1.2
 *--------------------------------------------------------------------------*/

var BannerController = Class.create({
	initialize: function (initObj) {		
		/** required initialization parameters **/
		this._bannerArray = initObj.bannerArray;
		
		/** optional initialization parameters **/
		this._bannerDelay = initObj.delay != null ? initObj.delay : 5000;
		this._autoStart = initObj.autoStart != null ? initObj.autoStart : true;
		this._autoUpdate = initObj.autoUpdate != null ? initObj.autoUpdate : true;
		this._enableEffects = initObj.enableEffects != null ? initObj.enableEffects : false;
		this._effectDuration = initObj.effectDuration != null ? initObj.effectDuration : 0.7;
		this._effectType = initObj.effectType != null ? (['slide','fade'].indexOf(initObj.effectType) != -1 ? initObj.effectType : 'fade') : 'fade';
		this._eventType = initObj.eventType != null ? (['click','mouseenter'].indexOf(initObj.eventType) != -1 ? initObj.eventType : 'mouseenter') : 'mouseenter';
		this._autoHideScrollButtons = initObj.autoHideScrollButtons != null ? initObj.autoHideScrollButtons : false;
		this._nextButtonId = initObj.nextButtonId != null ? initObj.nextButtonId : null;
		this._prevButtonId = initObj.prevButtonId != null ? initObj.prevButtonId : null;
		this._initialTabId = initObj.initialTabId != null ? initObj.initialTabId : null;
					
		/** private for internal use only **/
		this._activeButton = null;
		this._activeBanner = null;			
		this._currentBannerPosition = 0;		
		this._timer = null;		
		this._bannerChangePermitted = true;
		this._autoUpdateDisabledByAction = false;
									
		document.observe('dom:loaded', this._initBanner.bind(this));
		document.observe('banner_document:loaded', this._initBanner.bind(this));
	},
	
	_initBanner: function() {	
		this._resetInternalVars();

		var bannerInfo = this._bannerArray.first();	
		this._activeButton = $(bannerInfo.keys().first());
		this._activeBanner = $(bannerInfo.get(this._activeButton.id));

		if (this._autoHideScrollButtons) {
			this._doAutoHideScrollButtons();
		}

		if (this._initialTabId) {
			var temp = this._effectDuration;
			this._effectDuration = 0;
			this._switchTab(this._initialTabId);
			this._effectDuration = temp;
		}
		
		this._bindMouseEvents();		
				
		if (this._autoStart && this._autoUpdate) {						
			this._autoUpdateBanner();			
		}
	},
	
	_switchTab: function(buttonId) {
		if (this._isBannerChangePermitted()) {
			clearTimeout(this._timer);		
			if (this._activeButton.id != buttonId) {								
				this._doChangeBanner(buttonId);
			}												
			if (this._autoHideScrollButtons) {
				this._doAutoHideScrollButtons();
			}
		}
	},

	_doChangeBanner: function(buttonId) {				
		this._activeButton.removeClassName('selected');								
		var bannerInfo = this._getBannerInfo(buttonId);
		var bannerObj = $(bannerInfo.hashObj.get(buttonId));
		var buttonObj = $(buttonId);
		
		buttonObj.addClassName('selected');						
		this._activeButton = buttonObj;
		
		if (this._enableEffects) {
			if (this._effectType == 'fade') {
				this._hideBanner(this._activeBanner);				
				this._showBanner(bannerObj);
			}else if (this._effectType == 'slide') {
				this._slideBanner(bannerObj);
			}
		}else {
			this._activeBanner.hide();
			bannerObj.show();
		}
		
		this._activeBanner = bannerObj;	
		this._currentBannerPosition = bannerInfo.index;		
	},
	
	_slideBanner: function(bannerObj) {		
		var sliders = $A();			
		var currentSlidePosition = 0;
		var requestedSlidePosition = 0;
		this._bannerArray.each(function(item, position) {
			var slideId = item.values().first();
			if (bannerObj.id == slideId) {
				requestedSlidePosition = position;
			}
			if (this._activeBanner.id == slideId) {
				currentSlidePosition = position
			}				
			sliders.push(slideId);							
		}.bind(this));
		var slideCount = sliders.size();
		
		// calculate the size of the slides by getting the size of the first one.  This assumes the slides are all the same width
		var slideWidth = $(sliders.first()).getWidth();

		var xMove = Math.abs((requestedSlidePosition - currentSlidePosition) * slideWidth)
		if (requestedSlidePosition > currentSlidePosition) {
			xMove *= -1;
		}
		
				
		var _self = this;
		Effect.multiple(sliders, Effect.Move, {
			x: xMove,
			speed: 0,
			duration: _self._effectDuration,
			beforeStart: function() { _self._bannerChangePermitted = false; },
			afterFinish: function() { _self._bannerChangePermitted = true; }		
		});
	},
	
	_hideBanner: function(bannerObj) {		
		try {
			// cancel any effects currently being rendered
			var queue = Effect.Queues.get('hideQueue');
			queue.each(function(effect) { 
				if (effect.element.id != bannerObj.id) {
					effect.cancel(); 
					effect.element.hide();
					//console.log('cancelled hiding ' + effect.element.id);
				}
			});
			
			bannerObj.fade({
				duration: this._effectDuration, 					
				queue: { position: 'front', scope: 'hideQueue' }
			});				
		}catch(e) {
			// scriptaculous probably isn't loaded show just hide the banner without effects
			bannerObj.hide();
		}					
	}, 
	
	_showBanner: function(bannerObj) {		
		try {
			// cancel any effects currently being rendered
			var queue = Effect.Queues.get('showQueue');
			queue.each(function(effect) { 
				if (effect.element.id != bannerObj.id) {
					effect.cancel();
					//console.log('cancelled showing ' + effect.element.id);
				}
			});
											
			bannerObj.appear({					 
				duration: this._effectDuration,										
				queue: { position: 'front', scope: 'showQueue' }
			});
		}catch(e) {
			// scriptaculous probably isn't loaded show just hide the banner without effects
			bannerObj.show();
		}					
	},

	_autoUpdateBanner: function() {		
		if (this._autoUpdate) {			
			var nextBannerInfo = this._getNextBannerInfo();
			var nextButton = nextBannerInfo.keys().first();
						
			this._timer = setTimeout(function() { this._doChangeBanner(nextButton); this._autoUpdateBanner(); }.bind(this), this._bannerDelay);			
		}
	},	
	
	_isBannerChangePermitted: function() {
		return this._bannerChangePermitted;
	},

	_getBannerInfo: function(buttonId) {
		var bannerInfo = null;
		var position = 0;
		this._bannerArray.each(function(item, index) {				
			if (item.keys().first() == buttonId) {
				position = index;
				bannerInfo = item;								
				$break;
			}			
		});
		return {'index': position, 'hashObj': bannerInfo};
	},		

	_getNextBannerInfo: function() {
		var nextIndex = this._currentBannerPosition == this._bannerArray.size()-1 ? 0 : this._currentBannerPosition + 1;				
		return this._bannerArray[nextIndex];
	},
	
	_getPrevBannerInfo: function() {
		var prevIndex = this._currentBannerPosition == 0 ? this._bannerArray.size()-1 : this._currentBannerPosition - 1;  				
		return this._bannerArray[prevIndex];
	},
		
	_resumeAutoUpdateBanner: function(currentPosition) {
		if (this._isBannerChangePermitted()) {			
			clearTimeout(this._timer);			
			this._autoUpdateBanner();		
		}
	},
	
	_nextButtonHandler: function() {
		if (this._isBannerChangePermitted()) {
			clearTimeout(this._timer);
			var nextBannerInfo = this._getNextBannerInfo();
			var nextButton = nextBannerInfo.keys().first();			
			this._switchTab(nextButton);
		}
	},
	
	_prevButtonHandler: function() {
		if (this._isBannerChangePermitted()) {
			clearTimeout(this._timer);
			var prevBannerInfo = this._getPrevBannerInfo();
			var prevButton = prevBannerInfo.keys().first();			
			this._switchTab(prevButton);
		}
	},
			
	_bindMouseEvents: function() {
		this._bannerArray.each(function(item, position) {
			var buttonId = item.keys().first();			
			var buttonObj = $(buttonId);
						 			
			
			buttonObj.observe(this._eventType, function() {				
				this._switchTab(buttonId);
				if (this._autoUpdateDisabledByAction) {
					this._autoUpdate = true;
				}
			}.bind(this));
			
			if (this._autoUpdate) {
				if (this._eventType == 'click') {
					buttonObj.observe('mouseenter', function() {
						clearTimeout(this._timer);
						if (this._autoUpdateDisabledByAction) {
							this._autoUpdate = true;
						}
					}.bind(this));
				}
				
				buttonObj.observe('mouseleave', function() {						
					this._resumeAutoUpdateBanner(position);					
				}.bind(this));						
						
				var bannerId = item.values().first();
				var bannerObj = $(bannerId);			
			
				bannerObj.observe('mouseenter', function() {				
					clearTimeout(this._timer);				
					if (this._autoUpdateDisabledByAction) {
						this._autoUpdate = true;
					}
				}.bind(this));
				bannerObj.observe('mouseleave', function() {					
					this._resumeAutoUpdateBanner(position);					
				}.bind(this));
				
				// if you click on any of the descendant elements of a banner temporily disable autoUpdate
				bannerObj.descendants().invoke('observe', 'click', this.disableAutoUpdate.bind(this));
				
			}
		}.bind(this));

		// next and previous buttons if they exist
		var nextButtonObj = $(this._nextButtonId);
		if (nextButtonObj) {
			nextButtonObj.observe('click', this._nextButtonHandler.bind(this));			
		}
		
		var prevButtonObj = $(this._prevButtonId);
		if (prevButtonObj) {
			prevButtonObj.observe('click', this._prevButtonHandler.bind(this));			
		}
	},
	
	_resetInternalVars: function() {
		this._activeButton = null;
		this._activeBanner = null;			
		this._currentBannerPosition = 0;		
		this._timer = null;		
		this._bannerChangePermitted = true;
		this._autoUpdateDisabledByAction = false;
	},
	
	disableAutoUpdate: function() {
		clearTimeout(this._timer);
		this._autoUpdateDisabledByAction = true;
		this._autoUpdate = false;
	},
	
	_doAutoHideScrollButtons: function() {
		if (this._prevButtonId) {
			if (this._currentBannerPosition == 0) {  // first
				$(this._prevButtonId).hide();
			} else {
				$(this._prevButtonId).show();
			}
		}

		if (this._nextButtonId) {
			if (this._currentBannerPosition == this._bannerArray.size()-1) { // last
				$(this._nextButtonId).hide();
			} else {
				$(this._nextButtonId).show();
			}
		}
	},

    resetSlider: function() {
        if (this._isBannerChangePermitted()) {
            clearTimeout(this._timer);
            var banner_info = this._bannerArray.first();
            var button = banner_info.keys().first();
            this._switchTab(button);
        }

        this._initBanner();
    }
});
