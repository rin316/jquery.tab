/*!
 * main.js
 *
 */
 
(function ($, window, undefined) {

$(document).ready(function(){
	$('#sample1-1 .mod-tab-nav').tab();

	$('#sample2-1 .mod-tab-nav').tab({
		speed: 200
	});

	$('#sample3-1 .mod-tab-nav').tab({
		 cookie: true
		,cookieName: 'mod-tab-cookie'
		,fixedHeight: 'max'
	});

	$('#sample2-2 .mod-tab-nav').tab({
		hash: true
	});

	$('#sample4-1 .mod-tab-nav').tab({
		 navItemSelector: 'a'
		,active: 2
		,activeClass: 'current'
		,nonActiveClass: 'non-active'
		,bodyWrapperClass: 'mod-tab-bodyWrapper'
		,setClassChooseElement: true
		,setClassChooseElementSelector: '#sample4-1'
		,setClassChooseElementClass: 'mod-activeItem-'
		,speed: 200
		,fixedHeight: 'max'
	});
});

})(jQuery, this);
