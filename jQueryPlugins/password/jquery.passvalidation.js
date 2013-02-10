!(function($){
    'use strict';
	$.fn.passvalidation = function(){
	   var options, weight, colorize, checkweight, checkpassword, loginVal;
	   
	   options = $.extend({'minLength': 8
	                      ,'regularExp': ''
	                      ,'login': ''
	                      ,'regularExpCallback': function(match){$.log('password '+(match?'matches':'doesn\'t match')+' regular expression');}
	                      ,'weightCallback': function(weight){$.log('password weight is: '+weight);}
	                      },arguments[0]);
	   
	   colorize = function(){
	       $.log('colorize called: '+weight);
	   };
	   
	   checkweight = function(val){
	   	   $.log('checkweight called: '+val);
	       colorize();
	   };
	   
	   checkpassword = function(val){
	       var digits, pwdLength, uCaseChars, lCaseChars, specialChars;
	       pwdLength = val.length;
	       if(pwdLength >= options.minLength){
	           weight++;
	       }
	       digits = val.match(/(\d)/g);
	       if(digits){
	       	   weight += (pwdLength-digits.length>0?1:0);
	       }
	       uCaseChars = val.match(/[A-Z]/g);
	       if(uCaseChars){
	           weight += (pwdLength-uCaseChars.length>2?1:0);
	       }
	       lCaseChars = val.match(/[a-z]/g);
           if(lCaseChars){
               weight += (pwdLength-lCaseChars.length>2?1:0);
           }
	       specialChars = val.match(/(\W)/g);
	       if(specialChars){
	           weight += (pwdLength-specialChars.length>2?2:0);
	       }
	       // TODO: does'nt work currently
	       if('' !== options.login && $(options.login).is('input')){
	       	   if('' != (loginVal = $(options.login).val())){
    	           if(val.match(new RegExp(loginVal,'g'))){
    	               weight -= (pwdLength-options.login.length === 0 ? weight : 1);	           	
    	           }
	       	   }
	       }
	       if(weight >= 6){
	           $.log(val+' weight: '+weight);
	       }
	   };
	   
	   return this.each(function(){
	       /* some magic */
	   	   $(this).on('keyup', function(event){
	   	       // $.log('key'+event.keyCode+' => '+$(this).val());
	   	       weight = 0;
               checkpassword($(this).val());
	   	   });
	   });
	   
	};
}(window.jQuery));