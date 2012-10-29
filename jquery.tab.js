/*!
 * jquery.tab.js
 *
 * @varsion   1.0
 * @require   jquery.js, jquery.cookie.js
 * @create    2012-10-29
 * @modify    2012-10-29
 * @author    rin316 [Yuta Hayashi]
 * @link      https://github.com/rin316/jquery.tab/
 */
;(function ($, window, undefined) {

var Tab
	, DEFAULT_OPTIONS
	;

/**
 * DEFAULT_OPTIONS
 */
DEFAULT_OPTIONS = {
    navListSelector:  '.mod-tab-nav' //{string} selector
,   navItemSelector:  '.mod-tab-nav-item' //{string} selector
,   bodyListSelector: '.mod-tab-contents' //{string} selector
,   bodyItemSelector: '.mod-tab-contents-item' //{string} selector
,   active: 0 //{number} index number
,   activeClass: 'active' //{string}
,   cookie: false //{boolean} true: 最後にactiveにしたtabをcookieに記憶
,   cookieName: 'mod-tab-cookie' //{string}
,   setClassUseActiveItem: false //{boolean} setClassUseActiveItemClass + index番号を、setClassUseActiveItemSelectorにclassとして付与
,   setClassUseActiveItemClass: 'mod-activeItem-' //{string}
,   setClassUseActiveItemSelector: 'element' //{string} 'element' OR selector
,   speed: 150 //{number} animate speed
,   fixedHeight: true //{boolean} true: itemの高さを一番高いitemのheightに合わせる
};

/**
 * Tab
 */
Tab = function ($element, options) {
	var self = this;
	
	self.o = $.extend({}, DEFAULT_OPTIONS, options);
	
	self.$element = $element;
	self.$navList = self.$element.find($(self.o.navListSelector));
	self.$navItem = self.$navList.find($(self.o.navItemSelector));
	self.$bodyList = self.$element.find($(self.o.bodyListSelector));
	self.$bodyItem = self.$bodyList.find($(self.o.bodyItemSelector));
	self.$allItem = self.$bodyItem.add(self.$navItem);
	self.index = self.o.active;
	if (self.o.setClassUseActiveItem){
		self.setClassUseActiveItemElement = (function () {
			if (self.o.setClassUseActiveItemSelector === 'element'){
				return self.$element;
			} else {
				return self.$element.find($(self.o.setClassUseActiveItemSelector));
			}
		})();
	}
	self.isMoving = false;

	self.init();

	return self;
};//Tab


/**
 * Tab.prototype
 */
Tab.prototype = {
	/**
	 * init
	 */
	init: function () {
		var self = this;

		//cookieが存在すればself.indexを更新
		if (self.o.cookie) {
			if ($.cookie(self.o.cookieName)){
				self.index = $.cookie(self.o.cookieName);
			}
		}

		//active tabのみを表示
		self.animate('init');

		//active tabにclassをset
		self.setActiveClass();

		//active itemの番号を指定elementにclassとして付与
		if (self.o.setClassUseActiveItem){ self.setClassUseActiveItem(); }

		//itemの高さを一番高いitemのheightに合わせる
		if (self.o.fixedHeight) { self.fixedHeight()}

		//Click Event
		self.$navItem.on('click', function (e) {
			var index = self.$navItem.index(this);

			e.preventDefault();
			//self.indexを更新 更新が無ければ処理を停止
			if(! self.indexUpdate(index)) { return false; }

			//set cookie
			if (self.o.cookie) { $.cookie(self.o.cookieName, self.index); }

			//active tabのみを表示
			self.animate();

			//active classをset
			self.setActiveClass();

			//active itemの番号を指定elementにclassとして付与
			if (self.o.setClassUseActiveItem){ self.setClassUseActiveItem(); }
		});
	}
	,

	/**
	 * indexUpdate
	 * self.indexを引数のindexに更新する
	 * @param {number} index self.indexをこの値に書き換える。0から始まる
	 */
	indexUpdate: function (index) {
		var self = this;

		if (! self.isMoving) {
			//元のindex番号と同じならfalseを返す 変更があればindex更新
			if (self.index === index) {
				return false;
			} else {
				self.index = index;
				return true;
			}
		} else {
			return false;
		}

	}
	,

	/**
	 * setActiveClass
	 * self.index番目のnav, bodyにactive classをset
	 */
	setActiveClass: function () {
		var self = this;

		self.$allItem.removeClass(self.o.activeClass);
		self.$navItem.eq(self.index).addClass(self.o.activeClass);
		self.$bodyItem.eq(self.index).addClass(self.o.activeClass);
	}
	,

	/**
	 * setClassUseActiveItem
	 * active itemの番号を指定elementにclassとして付与
	 */
	setClassUseActiveItem: function () {
		var self = this
		,   i
		;

		for (i = 0; i < self.$navItem.length; i++){
			self.setClassUseActiveItemElement.removeClass(self.o.setClassUseActiveItemClass + i);
		}
		self.setClassUseActiveItemElement.addClass(self.o.setClassUseActiveItemClass + self.index);
	}
	,

	/**
	 * animate
	 * fadeアニメーション
	 */
	animate: function (init) {
		var self = this
		,   speed =  (init === 'init') ? 0 : self.o.speed
		;

		self.isMoving = true;
		self.$bodyItem.fadeOut(speed);
		setTimeout(function () {
			self.$bodyItem.eq(self.index).fadeIn(speed, function () {
				self.isMoving = false;
			});
		}, speed)
	}
	,

	/**
	 * fixedHeight
	 * itemの高さを一番高いitemのheightに合わせる
	 */
	fixedHeight: function () {
		var self = this
		,   maxH = 0
		;

		self.$bodyItem.each(function(){
			maxH = Math.max(maxH, $(this).outerHeight());
		});

		if(navigator.userAgent.indexOf("MSIE 6") != -1){
			self.$bodyList.height(maxH);
		}else{
			self.$bodyList.css({ minHeight: maxH + 'px' });
		}
	}
	
};//Tab.prototype


/**
 * $.fn.Tab
 */
$.fn.tab = function (options) {
	return this.each(function () {
		var $this = $(this);
		$this.data('tab', new Tab($this, options));
	});
};//$.fn.Tab


})(jQuery, this);
