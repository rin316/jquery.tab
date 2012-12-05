/*!
 * jquery.tab.js
 *
 * @varsion   1.1
 * @require   jquery.js, jquery.cookie.js(if cookie:true)
 * @create    2012-10-29
 * @modify    2012-12-05 hash機能追加
 * @author    rin316 [Yuta Hayashi] - http://5am.jp/
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
	 navItemSelector: 'a'                          // selector - e.g. a - hrefの設定された要素
	,active: 0                                     // number - e.g. 0 - 初期表示のindex number. 0から始まる
	,activeClass: 'current'                        // false || string - e.g. 'current' - activeなnav, bodyに付与するclass名。falseの場合は付与しない
	,nonActiveClass: false                         // false || string - active以外のnav, bodyに付与するclass名。falseの場合は付与しない
	,bodyWrapperClass: 'mod-tab-bodyWrapper'       // class - e.g.'mod-tab-bodyWrapper' - $bodyItemをwrapする要素のclass名。高さ調整に使用する
	,cookie: false                                 // true || false - true=最後にactiveにしたtabをcookieに記憶
	,cookieName: 'mod-tab-cookie'                  // string - e.g. 'mod-tab-cookie' - cookie名
	,hash: false                                   // true || false - true=URLのhashにtabのidがあればそのtabをcurrentにする
	,hashMoveDisabled: false                       // true || false - true=URLのhashにtabのidがあってもそのtabまでスクロールさせない(hash:true の時のみ適用)
	,setClassChooseElement: false                  // true || false - true=指定elementに対して「接頭辞+index番号」をclassとして付与。bodyなどにactive tabのclass名を付ける時に使用する
	,setClassChooseElementSelector: 'body'         // selector - 指定element (setClassChooseElement:trueの場合に使用)
	,setClassChooseElementClass: 'mod-activeItem-' // string - 接頭辞 (setClassChooseElement:trueの場合に使用)
	,speed: 0                                      // number - animation speed
	,fixedHeight: 'auto'                           // false || auto || max - false=高さを各itemの高さに変更, auto=高さを各itemの高さに変更(アニメーション), max=高さを一番高いitemの高さに統一
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
	self.hash = location.hash;
	self.index = self.o.active;
	self.isMoving = false;
	self.init();

	return self;
};//Tab


/**
 * Tab.prototype
 */
(function (fn) {
	/**
	 * init
	 */
	fn.init = function () {
		var self = this;
		//cookieが存在すればself.indexを更新
		if (self.o.cookie && $.cookie(self.o.cookieName)) {
			self.index = $.cookie(self.o.cookieName);
		}
		//高さを一番高いitemの高さに統一
		if (self.o.fixedHeight === 'max') { self.fixedHeight('max')}
		//active tabのみを表示
		self.animate('init');
		//URLにhashが含まれていたらそのhashの要素のindexをself.indexとしてcurrentにする
		self.indexUpdateUseHash(function () {
			//active tabを更新
			self.animate('init');
			//トップに移動、またはURL hashの位置に移動(animate,fixedHeightの後に実行する必要)
			self.movePosition();
		});
		//active tabにclassをset
		self.setClass();
		//指定elementに対して「接頭辞+index番号」をclassとして付与
		self.setClassChooseElement();
		//Eventをbind
		self.eventify();
	};

	/**
	 * eventify
	 * eventをbind
	 */
	fn.eventify = function () {
		var self = this;
		//Click Event
		self.$navItem.on('click', function (e) {
			e.preventDefault();
			//indexを取得
			var index = self.$navItem.index(this);
			//self.indexを更新 更新が無ければ処理を停止
			if(! self.indexUpdate(index)) { return false; }
			//set cookie
			if (self.o.cookie) { $.cookie(self.o.cookieName, self.index); }
			//active tabにclassをset
			self.setClass();
			//指定elementに対して「接頭辞+index番号」をclassとして付与
			self.setClassChooseElement();
			//active tabのみを表示
			self.animate();
			if (self.o.fixedHeight === 'auto') { self.fixedHeight('auto')}
		});
	};

	/**
	 * indexUpdateUseHash
	 * URLにhashが含まれていたらそのhashの要素indexをself.indexとしてcurrentにする
	 */
	fn.indexUpdateUseHash = function (callback) {
		if (this.o.hash && this.hash) {
			var self = this;
			self.$bodyItem.each(function (i) {
				$this = $(this);
				//URLのhashと$bodyItem[i]のidが同じであればself.indexを更新
				if (self.hash === ('#' + $this.attr('id'))) {
					self.index = i;
					callback();
					return false;
				}
			});
		}
	};

	/**
	 * movePosition
	 * トップに移動、またはURL hashの位置に移動
	 */
	fn.movePosition = function () {
		var  self = this
			,defaultScrollTop = $(window).scrollTop()
			,$targetBody
			;
		//html, bodyのどちらでscrollTopが取得できるか確認
		$(window).scrollTop( defaultScrollTop + 1 );
		if ( $('html').scrollTop() > 0 ) {
			$targetBody = $('html');
		} else if ( $('body').scrollTop() > 0 ) {
			$targetBody = $('body');
		}
		$(window).scrollTop( defaultScrollTop - 1 );

		//URLのhashにtabのidがあってもそのtabまでスクロールせずトップを表示
		if (self.o.hashMoveDisabled) {
			setTimeout(function () {
				$targetBody.animate({ scrollTop: 0 }, 0);
			}, 1);//fix IE 9 - 1/1000秒待たなければ移動しない
		} else {
			//fix Firefox16 - hash tabへのスクロール位置が下にずれているので正しい位置へfix
			var y = $(self.hash).offset().top;
			$targetBody.animate({ scrollTop: y }, 0);
		}
	};

	/**
	 * indexUpdate
	 * self.indexを引数のindexに更新する
	 * @param {number} index self.indexをこの値に書き換える。0から始まる
	 */
	fn.indexUpdate = function (index) {
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

	};

	/**
	 * setClass
	 * self.index番目のnav, bodyにactive classをset
	 * active以外のnav, bodyにnonActive classをset
	 *
	 */
	fn.setClass = function () {
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
	};

	/**
	 * setClassChooseElement
	 * 指定elementに対して「接頭辞+index番号」をclassとして付与
	 */
	fn.setClassChooseElement = function () {
		if (this.o.setClassChooseElement){
			var  self = this
				,i
				;
			for (i = 0; i < self.$navItem.length; i++){
				self.$setClassChooseElement.removeClass(self.o.setClassChooseElementClass + i);
			}
			self.$setClassChooseElement.addClass(self.o.setClassChooseElementClass + self.index);
		}
	};

	/**
	 * animate
	 * fadeアニメーション
	 * @param {string} state init=ready時にアニメーションせずtabを切り替える
	 */
	fn.animate = function (state) {
		var self = this;

		switch (state){
			//ready時にアニメーションせずtabを切り替える
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
	};

	/**
	 * fixedHeight
	 * itemの高さを調整する
	 */
	fn.fixedHeight = function () {
		if (this.o.fixedHeight) {
			var  self = this
				,height = 0
				;
			switch (self.o.fixedHeight){
				//auto:高さを各itemの高さに変更(アニメーション)
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
				//max:高さを一番高いitemの高さに統一
				case 'max':
					self.$bodyItem.each(function(){
						height = Math.max(height, $(this).outerHeight());
					});
					//IE6ならheight、それ以外ならmin-heightをset
					if (navigator.userAgent.indexOf("MSIE 6") != -1) {
						self.$bodyWrapper.height(height);
					} else {
						self.$bodyWrapper.css({ minHeight: height + 'px' });
					}
					break;
			}
		}
	};
})(Tab.prototype);//Tab.prototype


/**
 * $.fn.Tab
 */
$.fn.tab = function (options) {
	return this.each(function () {
		var $this = $(this);
		$this.data('tab', new Tab($this, options));
	});
};

})(jQuery, this);
