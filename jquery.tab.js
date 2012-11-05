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
	 navItemSelector: 'a'
	,active: 0 //{number} - 初期表示のindex number. 0から始まる
	,activeClass: 'current' //{boolean, string} - activeなnav, bodyに付与するclass名。falseの場合は付与しない
	,nonActiveClass: false //{boolean, string} - active以外のnav, bodyに付与するclass名。falseの場合は付与しない
	,bodyWrapperClass: 'mod-tab-bodyWrapper'
	,cookie: false //{boolean} true: - 最後にactiveにしたtabをcookieに記憶
	,cookieName: 'mod-tab-cookie' //{string}
	,setClassChooseElement: false //{boolean} - true: 指定elementに対して「接頭詞+index番号」をclassとして付与
	,setClassChooseElementSelector: 'body' //{string} - 'element' OR selector - 指定element(setClassChooseElement:trueの場合に使用)
	,setClassChooseElementClass: 'mod-activeItem-' //{string} - 接頭詞(setClassChooseElement:trueの場合に使用)
	,speed: 0 //{number} animate speed
	,fixedHeight: false //{boolean} - true: itemの高さを一番高いitemのheightに合わせる
};

/**
 * Tab
 */
Tab = function ($element, options) {
	var self = this;

	self.o = $.extend({}, DEFAULT_OPTIONS, options);

	self.$navItem = $element.find(self.o.navItemSelector);
	self.$bodyItem = $();
	self.$navItem.each(function () {
		self.$bodyItem = $.merge(self.$bodyItem, ($( $(this).attr('href') )));
	});

	self.$bodyItem.wrapAll($('<div/>',{ 'class': self.o.bodyWrapperClass}));
	self.$bodyWrapper = self.$bodyItem.parent();
	self.$allItem = self.$bodyItem.add(self.$navItem);
	self.$setClassChooseElement = $(self.o.setClassChooseElementSelector);
	self.index = self.o.active;
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

		self.setClass();//active tabにclassをset
		if (self.o.setClassChooseElement){ self.setClassChooseElement(); }//指定elementに対して「接頭詞+index番号」をclassとして付与
		self.animate('init');//active tabのみを表示
		if (self.o.fixedHeight) { self.fixedHeight('max')}//itemの高さを一番高いitemのheightに合わせる

		//Click Event
		self.$navItem.on('click', function (e) {
			var index = self.$navItem.index(this);
			e.preventDefault();

			if(! self.indexUpdate(index)) { return false; }//self.indexを更新 更新が無ければ処理を停止
			if (self.o.cookie) { $.cookie(self.o.cookieName, self.index); }//set cookie
			self.setClass();//active tabにclassをset
			if (self.o.setClassChooseElement){ self.setClassChooseElement(); }//指定elementに対して「接頭詞+index番号」をclassとして付与
			self.animate();//active tabのみを表示
			if (! self.o.fixedHeight) { self.fixedHeight('auto')}//itemの高さをゆっくり変更
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
	 * setClass
	 * self.index番目のnav, bodyにactive classをset
	 * active以外のnav, bodyにnonActive classをset
	 *
	 */
	setClass: function () {
		var self = this;

		self.$allItem
			.removeClass(self.o.activeClass)
			.addClass(self.o.nonActiveClass)
		;
		self.$navItem.eq(self.index)
			.addClass(self.o.activeClass)
			.removeClass(self.o.nonActiveClass)
		;
		self.$bodyItem.eq(self.index)
			.addClass(self.o.activeClass)
			.removeClass(self.o.nonActiveClass)
		;

	}
	,

	/**
	 * setClassChooseElement
	 * 指定elementに対して「接頭詞+index番号」をclassとして付与
	 */
	setClassChooseElement: function () {
		var self = this
		,   i
		;

		for (i = 0; i < self.$navItem.length; i++){
			self.$setClassChooseElement.removeClass(self.o.setClassChooseElementClass + i);
		}
		self.$setClassChooseElement.addClass(self.o.setClassChooseElementClass + self.index);
	}
	,

	/**
	 * animate
	 * fadeアニメーション
	 */
	animate: function (init) {
		var self = this;

		switch (init){
			case 'init':
				self.$bodyItem.hide();
				self.$bodyItem.eq(self.index).show();
				break;

			default:
				self.isMoving = true;

				self.$bodyItem.each(function () {
					if( $(this).is(':visible') ) {
						$(this).fadeOut(self.o.speed, function () {
							self.$bodyItem.eq(self.index).fadeIn(self.o.speed, function () {
								self.isMoving = false;
							});
						})
					}
				});
				break;
		}
	}
	,

	/**
	 * fixedHeight
	 * @param {string} heightState - max:itemの高さを一番高いitemのheightに合わせる auto:自動調整アニメーション
	 */
	fixedHeight: function (heightState) {
		var self = this
		,   height = 0
		;
		switch (heightState){
			case 'max':
				self.$bodyItem.each(function(){
					height = Math.max(height, $(this).outerHeight());
				});

				if (navigator.userAgent.indexOf("MSIE 6") != -1) {
					self.$bodyWrapper.height(height);
				} else {
					self.$bodyWrapper.css({ minHeight: height + 'px' });
				}
				break;

			case 'auto':
				self.isMoving = true;
				height= self.$bodyItem.eq(self.index).outerHeight();

				self.$bodyWrapper.animate(
					{ height: height },
					{
						duration: self.o.speed * 2
						,complete: function () {
							self.isMoving = false;
							$(this).css({ height: 'auto' });
						}
					}
				);
				break;
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
