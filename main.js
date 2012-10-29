/*!
 * main.js
 *
 */
 
(function ($, window, undefined) {

$(document).ready(function(){
	$('#sample1-1 .mod-tab').tab();

	$('#sample2-1 .mod-tab').tab({
	    cookie: true //{boolean} true: 最後にactiveにしたtabをcookieに記憶
	,   cookieName: 'mod-tab-cookie' //{string}
	,   setClassUseActiveItem: true //{boolean} setClassUseActiveItemClass + index番号を、setClassUseActiveItemSelectorにclassとして付与
	,   setClassUseActiveItemClass: 'mod-activeItem-' //{string}
	,   setClassUseActiveItemSelector: 'element' //{string} 'element' OR selector
	});

	$('#sample3-1 .mod-tab').tab({
	    active: 1 //{number} index number
	,   activeClass: 'active' //{string}
	,   speed: 1000 //{number} animate speed
	,   fixedHeight: false //{boolean} true: itemの高さを一番高いitemのheightに合わせる
	});
});


})(jQuery, this);
