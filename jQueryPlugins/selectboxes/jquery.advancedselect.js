/**
 * erweiterte Funktionen um mit Selectboxen umzugehen 1. Options mehrerer
 * Selectboxes nur Unique auswählbar machen
 * 
 * @requires jquery.selectboxes.js - Plugin by Sam Collett
 *           (http://www.texotela.co.uk)
 * @requires jquery.log.js - Plugin by Amal Samally [amal.samally(at)gmail.com]
 *           http://plugins.jquery.com/project/jQueryLog
 * @author siggip
 * @url https://github.com/SiggiP/Useful_Things
 */

;
(function($) {
  var items = [];
  /* Default Options */
  var options = {/* later */};
  var methods = {
    init : function(opts) {
      // extending options
      options = $.extend(options, opts);

      return this.each(function() {
            // $.log('called init: '+$(this).attr('name'));
            items.push(this);
          });

    },
    destroy : function() {
      return this.each(function() {
            // destroy the fancy stuff
            $.each(items, function(i, obj) {
                  $(obj).unbind('change')
                });
          });
    }
    /* unique selectboxes */
    ,
    makeunique : function() {
      $.each(items, function(i, obj) {
        $(obj).on('change', function() {
          var _that = this;
          var _thatSelected = $(this).val() != null ? $(this).val()
              .toString().split(',') : '';
          $.each(items, function(j, obj2) {
                if (i == j) {
                  return true; /* continue */
                }
                $(obj2).find('option:selected').each(
                    function() {
                      if (-1 != $.inArray($(this).val(),
                          _thatSelected)) {
                        $(this).prop('selected', false);
                      }
                    });
              });
        });
        if (i == 0) {
          $(items[0]).trigger('change');
        }
      });
    }
    // end unique selectboxes
  };
  /**
   * plugin authoring described at jquery.com
   */
  $.fn.advancedSelect = function(method) {

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(
              arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.thePlugin');
    }

  };

})(jQuery);