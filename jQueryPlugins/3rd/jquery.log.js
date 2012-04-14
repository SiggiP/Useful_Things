/**
 * jQuery Log
 * Fast & safe logging in Firebug console
 * 
 * @param mixed - as many parameters as needed
 * @return void
 * 
 * @url http://plugins.jquery.com/project/jQueryLog
 * @author Amal Samally [amal.samally(at)gmail.com]
 * @version 1.0
 * @example:
 *      $.log(someObj, someVar);
 *      $.log("%s is %d years old.", "Bob", 42);
 *      $('div.someClass').log().hide();
 */
(function($){
    jQuery.fn.log = function(msg) {
                if (!window.console || !console) return;
                if (window.console || console.firebug){
                        msg = msg || '';
                        if(msg !== '') msg += ': ';
                        console.log("%s%o", msg, this);
                }
                return this;
        };
        $.extend({
                log : function (msg) {
                        if (!window.console || !console) return;
                        if (window.console || console.firebug) {
                                console.log("%s", msg);
                        }
                }
        });
})(jQuery);
