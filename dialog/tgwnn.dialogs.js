/**
 * TGWNN - Dialogs
 * @author siggiP
 */
/* global singleton */
var G_TGWNN_DIALOG_FACTORY,
TGWNN_DIALOG_MODEL = Backbone.Model.extend({
    'initialize': function(){
        if(this.get('uid') === '') {
            this.set({'uid': Math.random().toString().replace(/0\./,'')});            
        }
    }
    ,'defaults': {'width': 400
                ,'height': 320
                ,'modal': false // modal or not
                ,'target': 'body' // target where editor will be placed
                ,'button': false // clickable object top open dialog
                ,'zIndex': 1000 // z-index
                ,'name': 'tgwnnDialog' // name - Selector ergibt sich aus name+'-'+uId
                ,'uid': '' // unique id
                ,'onHide': function(){} // on hide callback
                ,'onShow': function(){} // on show callback
                ,'onMinimize': function(){} // on minimize callback
                ,'onRestore': function(){}
                ,'onMaximize': function(){} // on maximize callback
                ,'onFinish': function(){} // on finish callback
                ,'onConfirm': function(){}
                ,'confirmButton': 'yes'
                ,'cancelButton': 'nope'
                ,'dragOpacity': 0.5 // opacity on Drag
                ,'followSpeed': 300 // wie schnell soll die Dialog-Box "nachscrollen"
                ,'minimizeTo': 'left' // wohin soll der Minimierte Dialog verschoben werden
                ,'minimizable': false
                ,'closeable': false
                ,'minimized': false
                ,'animateDuration': 200
                ,'title': 'Dialog Titel'
                ,'content': '<p>No content defined for this dialog</p>'
                ,'closeOnEscape': true // soll key-event "Esc" den Dialog schliessen?
                ,'position': {'top': 0, 'left': 0, 'scrollTop': 0, 'scrollLeft': 0, 'zIndex': 1000}
                ,'lastPosition': {'top': 0, 'left': 0, 'scrollTop': 0, 'scrollLeft': 0, 'zIndex': 1000}
                ,'auto': false
    }
    /**
     * shorthand to get DOM-Selector
     */
    ,'getSelector': function(){
        return '#dialog-'+this.get('uid');
    }
    ,'changePosition': function(position){
        this.set({'position': position});
    }
}) //TODO: later may be extended from TGWNN_BASE_MODEL
/* TODO: implementing Backbone.Collection and Backbone.View
,TGWNN_DIALOG_COLLECTION = Backbone.Collection.extend({
	'model': TGWNN_DIALOG_MODEL
   ,'getDialog': function(uid){
        return this.findWhere({'uid': uid});
   }
});*/
;
!(function($){
    var zIndex,    
    /* Dialog 
     * @param   object  -   options
     */
    tgwnnDialog = function(options){
    	var $minimize = $('<li class="dialogMinimize" title="close" id="minimize-dialog">&nbsp;</li>')
    	,$close = $('<li class="dialogClose" title="" id="close-dialog">&nbsp;</li>')
    	,self = this;
        
        this.$dialog = $('<div><div>');
               
        this.mData = new TGWNN_DIALOG_MODEL(options);
        
        // id dialog already exists -> remove
        G_TGWNN_DIALOG_FACTORY.removeDialog(this);
        
        /**
         * creates the DOM structure and initiates some events
         * @return object   - dialog
         */
        this.create = function(){               
            var _dialog_content = '<div class="box shadowBox">'
                                + '<div class="boxHeader tgwnn-dialog-drag"><p class="fleft">'+this.mData.get('title')+'</p>'
                                + '<ul class="m-dialog-ul fright"></ul>'
                                + '</div>'
                                + '<div class="innerBox" id="tgwnn-dialog-content'+this.mData.get('uid')+'">'
                                + this.mData.get('content')
                                + '</div>'
                                + '</div>';
                        
            this.$dialog.prop('id','dialog-'+this.mData.get('uid')).html(_dialog_content);
            
            dialogSelector = this.mData.getSelector(); //'#dialog-'+this.mData.get('uid');
            
            this.$dialog.appendTo(this.mData.get('target')).hide();
            
            if(this.mData.get('minimizable') === true) {
                $minimize.prop('id', 'minimize-dialog'+this.mData.get('uid'));
                this.$dialog.find('.m-dialog-ul').append($minimize);
            }
            if(this.mData.get('closeable') === true) {
                $close.prop('id', 'close-dialog'+this.mData.get('uid'));
                this.$dialog.find('.m-dialog-ul').append($close);
            }
            this.setCenter();
            
            this.$dialog.css({'left': this.position().left, 'position': 'absolute', 'top': this.position().top, 'z-index': this.position().zIndex});
           
            if(this.mData.get('auto') === true){
            	this.show();
            }           
           
            /* events */          
            $(window).bind('scroll', function(e) {
                // TODO: self.correct_position();                
            });
           
            $('#close-dialog'+self.mData.get('uid')+', #cancel-dialog'+self.mData.get('uid')).bind('click',function(e){                        
                e.stopPropagation();
                self.remove();
            });
            jQuery('#confirm-dialog'+this.mData.get('uid')).bind('click',function(e){                
                e.stopPropagation();
                self.mData.get('onConfirm')(self); 
                self.remove();
            });
            // close on escape
            if(self.mData.get('closeOnEscape') === true){
                $(document).delegate('body','keyup.tgwnndialog', function(e){
                    if(e.which == 27){
                        e.stopPropagation();
                        self.remove(); 
                        $(document).undelegate('body','keyup.tgwnndialog'); 
                    }
                });
            };
            /* minimize dialog */
            $('#minimize-dialog'+self.mData.get('uid')).click(function(e){
                e.stopPropagation();
                if($(this).hasClass('dialogMinimize')){
                    self.minimize();
                   $(this).removeClass('dialogMinimize').addClass('dialogRestore').attr('title','restore'); 
                }else{
                    self.restore();
                    $(this).removeClass('dialogRestore').addClass('dialogMinimize').attr('title','minimize');
                }
            });
            /* brings clicked dialog in front */
            $('body').on('click',this.mData.getSelector(), function(){
                self.focus();
            });           
           return this;
        };
          
        return this.create();
    };
    /**
     * shorthand to get position info from model
     * @return  object
     */
    tgwnnDialog.prototype.position = function(){
        return this.mData.get('position');
    };
    /**
     * displays dialog
     */
    tgwnnDialog.prototype.show = function(){
        var self = this;
        this.$dialog.show(1,function(){
                 // Triggering the callback if set                     
                 $.isFunction(self.mData.get('onShow')) && self.mData.get('onShow')(self);
            
                 $('.tgwnn-dialog-drag').css('cursor', 'move');
             
                 $(self.mData.getSelector()).draggable({'handle': '.tgwnn-dialog-drag'
                                             ,'opacity': self.mData.get('dragOpacity')
                                             ,'containment': 'window'
                                             ,'stop': function(e,ui){
                                                        self.mData.changePosition({'top': self.$dialog.css('top')
                                                                                  ,'left': self.$dialog.css('left')
                                                                                  ,'zIndex': self.$dialog.css('z-index')
                                                                                  ,'scrollTop': $(document).scrollTop()
                                                                                  ,'scrollLeft': $(document).scrollLeft()
                                                                                  });
                                                      }
                                             });
                 
                 $.isFunction(self.mData.get('onFinish')) && self.mData.get('onFinish')(self);                
        });
    };      
    tgwnnDialog.prototype.setLastPosition = function(){
    	var self = this;
        this.mData.set({'lastPosition': $.extend(this.mData.get('lastPosition'),{'top': this.$dialog.css('top'), 'left': this.$dialog.css('left'), 'zIndex': this.$dialog.css('zIndex')})});
    };
    tgwnnDialog.prototype.setPosition = function(position){
    	var self = this,
        newPosition = $.extend(this.mData.get('position'),position);
        this.mData.changePosition(this.mData.get('position'));
        this.$dialog.css({'top': this.mData.get('position').top, 'left': this.mData.get('position').left, 'z-index': this.mData.get('position').zIndex});
    };
    tgwnnDialog.prototype.focus = function(){
        var self = this;
        if(false === this.mData.get('minimized')) {
            G_TGWNN_DIALOG_FACTORY.setFocus(this);
        }
    };   
    /**
     * removes dialog from DOM
     */
    tgwnnDialog.prototype.remove = function(){
    	var self = this;
        if(typeof this.mData.get('onHide') === 'function'){
           this.mData.get('onHide')(this);
        }
        G_TGWNN_DIALOG_FACTORY.removeDialog(this);            
    };
    tgwnnDialog.prototype.minimize = function(){
        var self = this, _headerHeight, _bottom, _right, _left;
        
        this.setLastPosition();
        
        this.mData.set({'width': $('#tgwnn-dialog-content'+this.mData.get('uid')).innerWidth()});
        jQuery('#tgwnn-dialog-content'+this.mData.get('uid')).hide();
        
        // neue Position - rechts unten im sichtbaren Bereich
        _headerHeight = $(this.mData.getSelector()+' .tgwnn-dialog-drag').innerHeight()+14;
        _bottom = $(window).height()+$(document).scrollTop()-_headerHeight;
        _right = $(window).width()-this.$dialog.innerWidth();
        _left = 20;
        
        if(this.mData.get('minimizeTo') === 'right'){
            this.$dialog.animate({'top':_bottom, 'left':_right},this.mData.get('animateDuration'),function(){ self.mData.get('onMinimize')(self); });
        }else{
            this.$dialog.animate({'top':_bottom, 'left':_left},this.mData.get('animateDuration'),function(){ self.mData.get('onMinimize')(self); });
        }
        this.mData.set({'minimized':true});
        /**/
    };
    /**
     * restores minimized dialogs to their old position
     */
    tgwnnDialog.prototype.restore = function(){
        var self = this;
        $('#tgwnn-dialog-content'+this.mData.get('uid')).innerWidth(this.mData.get('width')).show();                            
        this.$dialog.animate(this.mData.get('lastPosition')
                             ,this.mData.get('animateDuration')
                             ,function(){ 
                                self.mData.get('onRestore')(self);
                                self.mData.set({'minimized':false});
                                G_TGWNN_DIALOG_FACTORY.setFocus(self);
                             }
                            );
    };
    /**
     * recalculates start position of Dialog und stores
     * previous position in lastposition
     */
    tgwnnDialog.prototype.setCenter = function(){            
        var self = this, position = this.mData.get('position'), defaultOffset = 30, offsetLeft = defaultOffset, offsetTop = defaultOffset, minTop = 20;
        this.mData.set({'lastPosition': position});
        position.scrollTop = $(document).scrollTop();
        position.scrollLeft = $(document).scrollLeft();
        position.top = (($(window).height() - this.$dialog.innerHeight()) / 2) - (minTop)+$(document).scrollTop();
        position.top = (position.top < 20 ? 20 : position.top);
        position.left = ($(window).width() < $('body').width()) ? 0 : ($('body').width() - $(window).width()) / 2;
        position.left = ($(document).scrollLeft() + (($(window).width() - this.$dialog.innerWidth()) / 2) + position.left);
        position.zIndex = G_TGWNN_DIALOG_FACTORY.getMaxZIndex()+1;
        /* offset of multiple dialogs */
        
        $.each(G_TGWNN_DIALOG_FACTORY.DialogCollection, function(idx, obj){
            if(obj.mData.get('uid') != self.mData.get('uid')){
                offsetLeft = Math.max(offsetLeft, defaultOffset)+defaultOffset;
                offsetTop = Math.max(offsetTop, defaultOffset)+defaultOffset;
            }
        });
        position.left = (position.left+offsetLeft)+'px';
        position.top  = (position.top+offsetTop)+'px';           
        this.mData.changePosition(position);
    };        
    /* end Dialog */
    
    /* DialogFactory */
    var tgwnnDialogFactory = function(){        
        // collection of created dialogs
        this.DialogCollection = [];
        var self = this;
        zIndex = 1000; // zIndex start           
        
                
    };
    /**
     * creates a new dialog object and add it to the collection
     * @return  object  -   tgwnnDialog
     */
    tgwnnDialogFactory.prototype.createDialog = function(){
        
        var options = $.extend({'title': 'TGWNN - Dialog'
                               ,'contentloader': 'Fehler: kein Content festgelegt'
                               ,'modal': false
                               }
                               ,arguments[0]);
        dialog = new tgwnnDialog(options);
        
        if(dialog.mData.get('button') !== false){
            dialog.mData.get('button').off('click');
            dialog.mData.get('button').on('click', function(){
                self.createDialog(options);
            });             
        }
        return this.addDialog(dialog);
    };   
    /**
     * max. z-index
     * @return int
     */
    tgwnnDialogFactory.prototype.getMaxZIndex = function(){
    	var self = this;
        if(this.DialogCollection.length > 1){
            $.each(this.DialogCollection, function(idx,obj){
                zIndex = Math.max(zIndex,obj.position().zIndex);
            });
        }
        return zIndex;
    }; 
    /**
     * brings dialog in front of all others
     * @param   object  - dialog
     */
    tgwnnDialogFactory.prototype.setFocus = function(dialog){    	
        var self = this, aktualZ = dialog.mData.get('position').zIndex, maxZ = this.getMaxZIndex();
        $.each(this.DialogCollection, function(idx,obj){
            if(obj.mData.get('minimized') === true){ return true;}                                
            if(obj.mData.get('uid') === dialog.mData.get('uid')){
                // move up
                dialog.setPosition({'top': dialog.$dialog.css('top'),'left': dialog.$dialog.css('left'),'zIndex': maxZ});
            }else{
                // move down
                obj.setPosition({'top': obj.$dialog.css('top'),'left': obj.$dialog.css('left'),'zIndex': maxZ-1});
            }
        });
    };
    /**
     * removes dialog from DOM and from collection
     * @param   object - dialog
     */
    tgwnnDialogFactory.prototype.removeDialog = function(dialog){    
        if(dialog instanceof tgwnnDialog){
            $(dialog.mData.getSelector()).remove();
            this.DialogCollection = _.filter(this.DialogCollection, function(obj){
                return obj.mData.get('uid') != dialog.mData.get('uid');                
            });
        }
    };    
    /* adds an dialog to the collection
     * if dialog exists, the properties will be updated
     * @param   object  -   tgwnnDialog
     */
    tgwnnDialogFactory.prototype.addDialog = function(dialog){            
        this.DialogCollection.push(dialog);            
        return dialog;
    };
    /**
     * recieves dialog from collection
     * @param   int -   Dialog.uid
     */
    tgwnnDialogFactory.prototype.getDialog = function(uid){ 
        var found = false;
        $.each(this.DialogCollection, function(idx, obj){
           if(obj.mData.get('uid') === uid){
               found = obj;
               return false;
           }            
        });
        return found;
    };
    tgwnnDialogFactory.prototype.openDialog = function(uid){
        this.getDialog(uid).show();
    };
    /* end DialogFactory */
    
    /* initialize global singleton */
    G_TGWNN_DIALOG_FACTORY = new tgwnnDialogFactory();
    
})(window.jQuery);