(function($) {
	
	window.carousel = [];
	
	var carouselClass = function(ins,options){
		this._name = ($(ins).attr('id'))?$(ins).attr('id') : $(ins).attr('class').replace(/ /g,"_");
		
		this._instance = ins;
		this.settings = options;
		this.methods = $.carousel.methods;
		$.extend(this.settings,options); 
		return name;
	};
	
	$.carousel = {};
	$.carousel.settings = {
		initPos:0,
		counter:true,
		transition:true,
		pager:true,
		linkBackCSS:'sprite-icons back',
		linkNextCSS:'sprite-icons next',
		patternCSS:'pattern',
		pagerCSS:'pager',
		linkback:'<a href="#back"></a>',
		linknext:'<a href="#next"></a>',
		container:'<ul></ul>',
		iterator:'<li></li>',
		pattern:'<div></div>',
		imagesSrc:[],
		withPattern:true,
		timer:false,
		reverse:true,
		_couterCarousel:0,
		scale:[],
		onChange:function(){},
		slide:0
	};
	$.carousel.services = {};
	
	$.carousel.methods = {
		init : function(instance) {
							
					instance.settings.drawItem = true;
					$(instance._instance).css('overflow','hidden');
					
					var linkBack = $(instance.settings.linkback).addClass(instance.settings.linkBackCSS).addClass('ui-carousel-back back-'+instance._name);
					var containerUl = instance.settings._container = $(instance.settings.container).addClass('ui-carousel-container container-'+instance._name);
					var pattern = $(instance.settings.pattern).addClass(instance.settings.patternCSS).addClass('ui-carousel-pattern pattern-'+instance._name);
					var linkNext = $(instance.settings.linknext).addClass(instance.settings.linkNextCSS).addClass('ui-carousel-next next-'+instance._name);
		
					instance.settings._limitImages = instance.settings.imagesSrc.length -1;
					
					for(var i=0; i <= instance.settings._limitImages; i++){
						var position = i*100;
						var it = $(instance.settings.iterator).addClass('ui-iterator ui-iterator-'+instance._name).css('left',position+'%').append("<div class='preloader'></div>");
						$(containerUl).append(it);
					}
	
					$(instance._instance).append(linkBack);
					$(instance._instance).append($(containerUl));
					$(instance._instance).append(pattern);
					$(instance._instance).append(linkNext);
					
					if(instance.settings.pager){
						$(instance._instance).append('<div class="'+instance.settings.pagerCSS+'"><span class="count">1</span>/<span class="total">'+instance.settings.imagesSrc.length+'</span></div>');
					}
					instance.settings.listIterator = $(containerUl).find('.ui-iterator-'+instance._name);
					
					$(instance.settings.listIterator).each(function(item,value){
						instance.methods.drawImages(item,value,instance);
					});
					instance.methods.validateCarouselUI(instance);
		},
		drawImages:function(item,value,newCarousel){
			var src = newCarousel.settings.imagesSrc[item];
				var img = new Image();
				img.id = newCarousel._name+'-'+item;
				img.src = src;
				
				$(img).load(function(options){
					var longitude = newCarousel.settings.scale.length;
					
					$(this).fadeIn();
					$(value).append(this);
					$(this).parent().find('.preloader').remove();
					
					$(this).css('height','auto');
					
					if(longitude > 1){
						var val = newCarousel.settings.scale[item];
						var fVal = (val) ? val : 'auto';
						var midValue =  (100 - parseFloat(fVal))/2;
						if(fVal){
							$(this).css('margin-left',midValue+'%');
							$(this).css('width',fVal);
						}
					}
				});			
		},
		validateCarouselUI:function(newCarousel){
			var counter = 0;
			$(newCarousel.settings.listIterator).each(function(item,value){
				var $this = $(value);
				var position = counter * 100;
				$this.css('left',position+'%');
				counter++;
			});
			
			newCarousel.settings._limitImages = counter-1;
			
			$(newCarousel._instance).attr('pos',0);
			if(newCarousel.settings.initPos > 0){
				$(newCarousel._instance).attr('pos',newCarousel.settings.initPos * (-1));
				var $acLeft = (100*newCarousel.settings.initPos) *(-1);
				newCarousel.methods.movePanel($acLeft,newCarousel);
			}
			
			newCarousel.settings._reverse = false;
			
			$('.back-'+newCarousel._name).click(function(){
				var $pos = $(newCarousel._instance).attr('pos');
				if($pos < 0){
					$pos++;
					var $acLeft = (100*$pos);
					$(newCarousel._instance).attr('pos', $pos);
					newCarousel.methods.movePanel($acLeft,newCarousel);
				}else{
					newCarousel.settings._reverse = false;
				}
			});
			
			$('.next-'+newCarousel._name).click(function(){
				var $pos = $(newCarousel._instance).attr('pos');
				var $posInt = parseInt($pos,10)*(-1);
				if(($pos <= 0) && $posInt < newCarousel.settings._limitImages){
					$pos--;
					var $acLeft = (100*$pos);
					$(newCarousel._instance).attr('pos', $pos);
					newCarousel.methods.movePanel($acLeft,newCarousel);
				}else{
					if(newCarousel.settings.reverse){
						newCarousel.settings._reverse = true;
					}else{
						var $self = $(newCarousel._instance).find('.ui-carousel-container');
						$self.css('left',0);
						$(newCarousel._instance).attr('pos',0);
						$(newCarousel._instance).find('.pager .count').html(1);
						newCarousel.settings._reverse = false;
					}
				}
			});
			
			if(newCarousel.settings.timer){
				newCarousel.settings.intrevalID = setInterval(function(){newCarousel.methods.triggerMove(newCarousel);},newCarousel.settings.timer);	
			}
	
		},
		triggerMove:function(newCarousel){
			if(!newCarousel.settings._reverse){
				$('.next-'+newCarousel._name).trigger('click');
			}else{
				$('.back-'+newCarousel._name).trigger('click');
			}
		},
		movePanel:function($acLeft,newCarousel){
			var $pos = $(newCarousel._instance).attr('pos');
			var $posInt = parseInt($pos,10)*(-1);
			$(newCarousel._instance).find('.pager .count').html($posInt + 1);
			
			var $self = $(newCarousel._instance).find('.ui-carousel-container');
			if(!newCarousel.settings.transition){
				$self.css('left',$acLeft+'%');
			}else{
				
				if(jQuery.easing.easeInBack){
					$($self).stop().animate({
						left:$acLeft+'%'
					},{duration:1000 , easing:'easeOutExpo'});
				}else{
					$($self).stop().animate({
						left:$acLeft+'%'
					},1000,function(){});
				}
			}
			newCarousel.settings.onChange($posInt+1);	
		},
		gotoSlide:function(params){
			var newPos = parseFloat(params.instance.settings.slide) - 1;
			var newCarousel = params.instance;
			var $pos = newPos * (-1);
			var moveto = (newPos * 100)*(-1);
			var $self = $(newCarousel._instance).find('.ui-carousel-container');
			
			$(newCarousel._instance).find('.pager .count').html(params.instance.settings.slide);
			$(newCarousel._instance).attr('pos',$pos);
			
			if(($pos <= 0) && newPos < (newCarousel.settings._limitImages +1)){
				if(!newCarousel.settings.transition){
					$self.css('left',$acLeft+'%');
				}else{
					if(jQuery.easing.easeInBack){
						$($self).stop().animate({
							left:moveto+'%'
						},{duration:1000 , easing:'easeOutExpo'});
					}else{
						$($self).stop().animate({
							left:moveto+'%'
						},1000,function(){});
					}
				}
				
				newCarousel.settings.onChange(params.instance.settings.slide);
			}
		}
	};
	
	$.fn.carousel = function(options) {
		
		var __instance = this;
		
		__instance.existCarousel = function(){
			var $this = $(__instance);
			var instance = __instance;
			$.each(window.carousel,function(item,value){
				var id  = ($this.attr('id'))?$this.attr('id') : $this.attr('class').replace(/ /g,"_");
				if(id == value._name){
					instance = value;	
				}
			});
			return instance;
		};
	
		if(typeof options != 'string'){
			var instOptions = $.extend({},$.carousel.settings,options);
			var instance = this;
			
			return this.each(function () {
				var $this = $(this);
				if($this.attr('carousel') == 'created'){
					instance = __instance.existCarousel();
					$.extend(instance.settings,options); 
				}else{
					instance = new carouselClass($this, instOptions);
					$this.attr('carousel','created');
					window.carousel.push(instance);
					instance.methods.init(instance);
				}
			});
		}else if(typeof options == 'string'){
			instance = __instance.existCarousel();
			var objectParams = {};
			objectParams.instance = instance;
			objectParams.options = options;
			return instance.methods[options].apply(__instance, [objectParams]);
		}else{
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
		
		return false;
	};
	
	
})(jQuery);

var attachCarousel = (function() {
});
window.attachCarousel = window.$attachCarousel = attachCarousel;