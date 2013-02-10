!(function($){
    'use strict';
	$.fn.passvalidation = function(){
	   var options, colorize, checkweight, weight;
	   
	   options = $.extend({},arguments[0]);
	   
	   colorize = function(){
	       $.log('colorize called: '+weight);
	   };
	   
	   checkweight = function(val){
	   	   $.log('checkweight called: '+val);
	       colorize();
	   };
	   
	   return this.each(function(){
	       /* some magic */
	   	   weight = 0;
	   	   $(this).on('keyup', function(event){
	   	       $.log('key'+event.keyCode+' => '+$(this).val());
	   	       checkweight($(this).val());
	   	   });
	   });
	   
	};
}(window.jQuery));