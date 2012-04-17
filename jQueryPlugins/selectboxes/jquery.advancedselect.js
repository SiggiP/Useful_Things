/**
 * Copyright (c) 2012 Sigurd Päßler (http://www.tgwnn.de , https://github.com/SiggiP)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
 * A set of Jquery-Plugins to handle Selectboxes
 * @author  siggip
 */

/**
 * 1. plugin: uniqueSelectbox
 * Only select options with the same value once in a set
 * of multiple selectboxes
 * 
 * @version  1.1.0
 * 
 * @requires jquery > 1.7.1 
 * @author siggip
 * @url https://github.com/SiggiP/Useful_Things
 * 
 */
;
(function($) {
  /* Default Options */
  var options = {/* later */};
  var methods = {
    init : function(opts) {
      // extending options
      options = $.extend(options, opts);
      return this.each(function() {
          }).uniqueSelect('makeunique');
    },
    destroy : function() {
      return this.each(function() {
            $(this).unbind('change');            
          });
    },
    /* unique selectboxes */
    makeunique : function() {
      var selectboxes = $(this);	
      $(selectboxes).each(function() {
        $(this).on('change', function() {
          var _changedBox = this;
          var _changedBoxSelected = $(_changedBox).val() != null ? $(_changedBox).val()
              .toString().split(',') : '';
          $(selectboxes).each(function() {
                if(_changedBox == this) {
                  return true; /* continue */
                }
                $(this).find('option:selected').each(
                    function() {
                      if (-1 != $.inArray($(this).val(),
                          _changedBoxSelected)) {
                        $(this).prop('selected', false);
                      }
                    });
              });
        }).trigger('change');
      });
    }
  };
  $.fn.uniqueSelect = function(method) {

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(
              arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.uniqueSelect');
    }

  };

})(jQuery);

/**
 * 2. plugin:
 * move options between 2 selectboxes
 * 
 * @version  1.0.0
 * 
 * @requires jquery > 1.7.1 
 * @requires jquery.selectboxes.js - Plugin by Sam Collett
 *           (http://www.texotela.co.uk)
 * @requires jquery.log.js - Plugin by Amal Samally [amal.samally(at)gmail.com]
 *           http://plugins.jquery.com/project/jQueryLog
 * @author siggip
 * @url https://github.com/SiggiP/Useful_Things
 * 
 */
(function($) {
  /* Default Options */
  var options = {/* later */};
  var methods = {
    init : function(opts) {
      // extending options
      options = $.extend(options, opts);
      return $(this).each(function() {            
          }).movableSelect('makemovable');
    },
    destroy : function() {
      return this.each(function() {
            $(this).each(function() {
                  $(this).unbind('dblclick')
                });
          });
    },
    /* movable options selectboxes */
    makemovable : function() {
      var selectboxes = $(this);	
      $(selectboxes).each(function() {
        $.log('item'+$(this).attr('class')+': '+$(this).attr('name'));
        $(this).find('option').on('dblclick', function(){_move(selectboxes, this);});
      });
    }
  };
  /**
   * @access private
   */
  function _move(selectboxes, _clicked) {
            var _clickedSelectbox = $(_clicked).parent('select');
            $(selectboxes).each(function(){
                var _obj2 = $(this);
                if(!$(_obj2).attr('name') || !$(_clickedSelectbox).attr('name')){
                    return true; /* skip */
                }
                if($(_obj2).attr('name') == $(_clickedSelectbox).attr('name')){
                    var _selectbox = $(_clickedSelectbox).unbind('dblclick');
                    $(_selectbox).removeOption($(_clicked).val()).find('option');                    
                }else{
                    $(_obj2).addOption($(_clicked).val(),$(_clicked).text());
                    $(_obj2).find('option').on('dblclick', function(){_move(selectboxes, this);});
                }
            });  
  };
  $.fn.movableSelect = function(method) {

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(
              arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.movableSelect');
    }

  };

})(jQuery);
