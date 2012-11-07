/*!
 * main.js
 *
 */
 
(function ($, window, undefined) {

$(document).ready(function(){
	$('#sample1-1 .mod-tab-nav').tab();
});

$(document).ready(function(){
	$('#sample2-1 .mod-tab-nav').tab({
		speed: 200 //{number} animate speed
	});
});

$(document).ready(function(){
	$('#sample3-1 .mod-tab-nav').tab({
		cookie: true //{boolean} true: - 最後にactiveにしたtabをcookieに記憶
		,cookieName: 'mod-tab-cookie' //{string}
		,fixedHeight: true //{boolean} - true: itemの高さを一番高いitemのheightに合わせる
	});
});

$(document).ready(function(){
	$('#sample4-1 .mod-tab-nav').tab({
		 navItemSelector: 'a'
		,active: 2 //{number} - 初期表示のindex number. 0から始まる
		,activeClass: 'current' //{boolean, string} - activeなnav, bodyに付与するclass名。falseの場合は付与しない
		,nonActiveClass: 'non-active' //{boolean, string} - active以外のnav, bodyに付与するclass名。falseの場合は付与しない
		,bodyWrapperClass: 'mod-tab-bodyWrapper'
		,cookie: false //{boolean} true: - 最後にactiveにしたtabをcookieに記憶
		,cookieName: 'mod-tab-cookie' //{string}
		,setClassChooseElement: true //{boolean} - true: 指定elementに対して「接頭詞+index番号」をclassとして付与
		,setClassChooseElementSelector: 'body' //{string} - 'element' OR selector - 指定element(setClassChooseElement:trueの場合に使用)
		,setClassChooseElementClass: 'mod-activeItem-' //{string} - 接頭詞(setClassChooseElement:trueの場合に使用)
		,speed: 200 //{number} animate speed
		,fixedHeight: true //{boolean} - true: itemの高さを一番高いitemのheightに合わせる
	});
});


})(jQuery, this);
