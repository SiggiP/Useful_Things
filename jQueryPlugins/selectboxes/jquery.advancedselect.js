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
 * @version  1.1.0
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
                  $(this).unbind('dblclick');
                });
          });
    },
    /* movable options selectboxes */
    makemovable : function() {
      var selectboxes = $(this);
      $(selectboxes).each(function() {
        // $.log('item'+$(this).attr('class')+': '+$(this).attr('name'));
        var _that = this;
        $(this).find('option').one('dblclick', function(){ 
            _move(selectboxes, this);
        });
      });
    }
  };
  /**
   * @param  object -   selectboxes
   * @param  object -   clicked option
   * @access private
   */
  function _move(selectboxes, _clicked) {
            var _clickedSelectbox = $(_clicked).parent('select');
            $.when($(selectboxes).each(function(){
                var _obj2 = $(this);
                if(!$(_obj2).attr('name') || !$(_clickedSelectbox).attr('name')){
                    return true; /* skip */
                }
                if($(_obj2).attr('name') == $(_clickedSelectbox).attr('name')){
                    var _selectbox = $(_clickedSelectbox);
                    $(_clicked).unbind('dblclick');
                    $(_selectbox).removeOption($(_clicked).val()).find('option');
                }else{
                    $(_obj2).addOption($(_clicked).val(),$(_clicked).text());
                    $(_obj2).find('option').one('dblclick', function(){ 
                        _move(selectboxes, this);
                    });
                }
            })).done(function(){
                if($(_clickedSelectbox).attr('name')){
                    _sort(selectboxes,$(_clickedSelectbox).attr('name'), {});
                }
            });
            
  };
  /**
   * Sortieren der Selectboxes
   * @param  object  -   selectboxes
   * @param  string  -   name of selectbox of the clicked option element
   * @param  object  - options = {sortby: 'val' | 'text', asc: true | false}
   * @access private
   */
  function _sort(selectboxes,_clickedName, options){
        // $.log('Sorting selectboxes '+$(selectboxes).length+' by '+sortby);
        // $.log('clicked: '+_clickedName);
        
        opts = $.extend({sortby: 'val', asc: true});
        
        $(selectboxes).each(function(){            
            if(_clickedName == $(this).attr('name')){
                return true; 
            }
            
            var sortedOptions = [];
                        
            $(this).find('option').each(function(){
                
                // $.log('option2sort: '+$(this).val()+' = '+$(this).text()+' by '+opts.sortby);
                
                sortedOptions.push({value: $(this).val(), text: $(this).text()});
                
                // sort items in array
                sortedOptions.sort(
                    function(o1, o2){
                        // option text is made lowercase for case insensitive sorting
                        if(opts.sortby == 'text'){
                            o1t = o1.text.toLowerCase(), o2t = o2.text.toLowerCase();
                            // if options are the same, no sorting is needed
                            if(o1t == o2t) return 0;
                            if(a)
                            {
                                return o1t < o2t ? -1 : 1;
                            }
                            else
                            {
                                return o1t > o2t ? -1 : 1;
                            }
                        }else{
                            o1v = o1.value.toLowerCase(), o2v = o2.value.toLowerCase();
                            // if options are the same, no sorting is needed
                            if(o1v == o2v) return 0;
                            if(opts.asc)
                            {
                                return o1v < o2v ? -1 : 1;
                            }
                            else
                            {
                                return o1v > o2v ? -1 : 1;
                            }
                        }                        
                    }
                );
            }); // end each option
            $(this).find('option').each(function(i,obj){
                    $(obj).text(sortedOptions[i].text);
                    $(obj).val(sortedOptions[i].value);
            });
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
