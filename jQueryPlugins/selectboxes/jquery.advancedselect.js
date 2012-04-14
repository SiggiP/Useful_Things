/**
 * 1. plugin:
 * only select options with the same value once in a set
 * of multiple selectboxes
 * 
 * @version  1.0.1
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
            items.push(this);
          }).uniqueSelect('makeunique');

    },
    destroy : function() {
      return this.each(function() {
            $.each(items, function(i, obj) {
                  $(obj).unbind('change')
                });
          });
    },
    /* unique selectboxes */
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
        }).trigger('change');
      });
    }
  };
  /**
   * plugin authoring described at jquery.com
   */
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
 * @version  0.0.1
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
  var items = [];
  /* Default Options */
  var options = {/* later */};
  var methods = {
    init : function(opts) {
      // extending options
      options = $.extend(options, opts);
      return this.each(function() {
            items.push(this);
          }).movableSelect('makemovable');

    },
    destroy : function() {
      return this.each(function() {
            $.each(items, function(i, obj) {
                  $(obj).unbind('dblclick')
                });
          });
    },
    /* movable options selectboxes */
    makemovable : function() {     
      $.each(items, function(i, obj) {
        $.log('item'+i+': '+$(obj).attr('name'));
        // var _that = this;
        $(obj).find('option').on('dblclick', function(){_move(this,obj);});
      });
    }
  };
  /**
   * @access private
   */
  function _move() {            
            var _clicked = $(arguments[0]);
            var obj = arguments[1];
            $.log('doubleclicked: '+$(_clicked).val()+':'+$(_clicked).html());
            
            $.each(items, function(j,obj2){
                if(obj2 == obj){
                    var _selectbox = $(_clicked).parent('select');
                    $.log(' remove '+_clicked.val()+':'+_clicked.text()+' from '+_selectbox.attr('name'));
                    $(_selectbox).removeOption(_clicked.val());                    
                }else{
                    $.log(' add '+_clicked.val()+':'+_clicked.text()+' to '+$(obj2).attr('name'));
                    $(obj2).addOption(_clicked.val(),_clicked.text()).find('option').on('dblclick', function(){_move(this,obj2);});
                    $(obj2).sortOptions();
                }
            });  
  };
  /**
   * plugin authoring described at jquery.com
   */
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
