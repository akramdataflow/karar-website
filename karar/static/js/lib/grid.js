/*!
 * The Grid – Core jQuery Plugin
 * Copyright © 2015 All Rights Reserved. 
 * @author Themeone [http://template-one.com/the-grid/]
 */

/*global jQuery:false*/
/*global tg_global_var:false*/
/*global SC:false*/
/*global YT:false*/
/*global $f:false*/
/*global mejs*/
/*global TG_Slider:false*/
/*global TG_metaData*/
/*global TG_excludeItem*/
/*global FOOBOX*/
/*func = shorthand if function */

// The Grid default settings
var tg_global_var = false;
var The_Grid = {
	preview : '#tg-grid-preview-inner',
	wrapper : '.tg-grid-wrapper',
	slider  : '.tg-grid-slider',
	grid    : '.tg-grid-holder',
	loader  : '.tg-grid-preloader',
	ajax    : '.tg-ajax-button',
	ajaxMsg : '.tg-ajax-scroll-holder',
	sizer   : '.tg-grid-sizer',
	gutter  : '.tg-gutter-sizer',
	item    : '.tg-item',
	itemImg : '.tg-item-image',
	gallery : '.tg-item-gallery-holder',
	tooltip : '.tg-filter-count',
	filterH : '.tg-filters-holder',
	filter  : '.tg-filter, .tg-filters-holder select',
	search  : '.tg-search',
	clear   : '.tg-search-clear',
	sorter  : '.tg-sorters-holder',
	sorterBy: '.tg-sorter li, select.tg-sorter',
	sortASC : '.tg-sorter-order',
	arrLeft : '.tg-left-arrow',
	arrRight: '.tg-right-arrow',
	bullets : '.tg-slider-bullets',	
	pages   : '.tg-page-ajax',
	sortData: {
		excerpt : 'p',
		title   : function(elem) {
        	return jQuery(elem).data('title');
      	},
		id      : function(elem) {
        	return jQuery(elem).data('id');
      	},
		date    : function(elem) {
        	return jQuery(elem).data('date');
      	},
		author  : function(elem) {
        	return jQuery(elem).data('author');
      	},
		comment : function(elem) {
        	return jQuery(elem).data('comment');
      	},
		popular_post : function(elem) {
        	return jQuery(elem).data('popular-post');
      	},
		total_sales   : function(elem) {
        	return jQuery(elem).data('total-sales');
      	},
		regular_price : function(elem) {
        	return jQuery(elem).data('regular-price');
      	},
		sale_price : function(elem) {
        	return jQuery(elem).data('sale-price');
      	},
		featured   : function(elem) {
        	return jQuery(elem).data('featured');
      	},
		stock      : function(elem) {
        	return jQuery(elem).data('stock');
      	},
		sku        : function(elem) {
        	return jQuery(elem).data('sku');
      	}
	},
    defaults: {
		//init       : function() {},
		//relayout   : function() {},
		style      : 'grid',
		layout     : 'vertical',
		fitrows    : false,
		fullWidth  : null,
		fullHeight : null,
		rtl        : true,
		filterComb : false,
		filterLogic: 'AND',
		filterLoad : '',
		sortByLoad : '',
		orderLoad  : false,
		row        : 1,
		ratio      : 1,
		gutters    : [[9999,0],[1200,0],[980,0],[768,0],[480,0],[320,0]],
        cols       : [[9999,4],[1200,3],[980,3],[768,2],[480,1],[320,1]],
		rows       : [[9999,240],[1200,240],[980,220],[768,220],[480,200],[320,200]],
		animation  : [{'name':'None'},{'visible':''},{'hidden':''}],
		transition : 0,
		itemNav    : null,
		swingSpeed : 500,
		cycleBy    : null,
		cycle      : 5000,
		startAt    : 0,
		ajaxMethod : null,
		ajaxDelay  : 0,
		preloader  : 0,
		itemDelay  : 0,
		gallery    : false
    }
};

// Extend sortby with custom metadata
var tg_meta_data = tg_global_var.meta_data;
var tg_custom_sorter = {};
if (tg_meta_data) {
	for (var i = 0; i < tg_meta_data.length; i++) {
		var tg_cmk = tg_meta_data[i].key;
		tg_cmk = (tg_cmk.length && tg_cmk[0] == '_') ? tg_cmk.slice(1) : tg_cmk;
		var tg_cma = tg_cmk.replace(/\_/g, '-');
		(function(tg_cma){
			tg_custom_sorter[tg_cmk] = function(elem) {
				return jQuery(elem).data(tg_cma);
			};
		})(tg_cma);
	}
}
// add new custom sorter to the grid
The_Grid.sortData = jQuery.extend({}, The_Grid.sortData, tg_custom_sorter);

var tg_debounce_resize = (tg_global_var.debounce) ? 'debouncedresize' : 'resize'; // debounce resize functionnality
var tg_is_mobile = (tg_global_var.is_mobile); // check is we are on a mobile device

(function($) {
				
	"use strict";
	
	// the grid jquery plugin
	$.fn.The_Grid = function(options) {
		
		// Loop foreach grid (multi instance)
		return this.each(function () {
			
			// current grid
			var el = $(this);

			
			// define main DOM
			var ID        = el.closest(The_Grid.wrapper).attr('id'),
				$wrapper  = ($('[id="'+ID+'"]').length > 1) ? el.closest(The_Grid.wrapper) : $('#'+ID),
				$pages    = $wrapper.find(The_Grid.pages);

			// retireve all data
			var data = el.data();

			// get grid settings (check for existing key in case php errors)
			var settings = {
				//init        : options.init,
				//relayout    : options.relayout,
				style       : (data.style)       && data.style,
				layout      : (data.layout)      && data.layout,
				fitrows     : (data.fitrows)     && data.fitrows,
				fullWidth   : (data.fullwidth)   && data.fullwidth,
				fullHeight  : (data.fullheight)  && data.fullheight,
				rtl         : (data.rtl)         && data.rtl,
				filterComb  : (data.filtercomb)  && data.filtercomb,
				filterLogic : (data.filterlogic) && data.filterlogic,
				filterLoad  : (data.filterload)  && data.filterload,
				sortByLoad  : (data.sortbyload)  && data.sortbyload,
				orderLoad   : (data.orderload)   && data.orderload,
				row         : (data.row)         && data.row,
				ratio       : (data.ratio)       && data.ratio,
				gutters     : (data.gutters)     && data.gutters,
				cols        : (data.cols)        && data.cols,
				rows        : (data.rows)        && data.rows,
				animation   : (data.animation)   && data.animation,
				transition  : (data.transition)  && data.transition,
				itemNav     : (data.slider)      && data.slider.itemNav,
				swingSpeed  : (data.slider)      && data.slider.swingSpeed,
				cycleBy     : (data.slider)      && data.slider.cycleBy,
				cycle       : (data.slider)      && data.slider.cycle,
				startAt     : (data.slider)      && data.slider.startAt,
				ajaxMethod  : (data.ajaxmethod)  && data.ajaxmethod,
				ajaxDelay   : (data.ajaxdelay)   && data.ajaxdelay,
				preloader   : (data.preloader)   && data.preloader,
				itemDelay   : (data.itemdelay)   && data.itemdelay,
				gallery     : (data.gallery)     && data.gallery,
			};

			// check/set settings compare to default grid
			var options = $.extend({},The_Grid.defaults, settings);
			// sort cols array desc numeric (for futur column number detection)
			options.cols.sort(function(a, b){return b[0]-a[0];});
			// sort gutters array desc numeric (for futur rows height detection)
			options.gutters.sort(function(a, b){return b[0]-a[0];});
			// sort rows array desc numeric (for futur rows height detection)
			options.rows.sort(function(a, b){return b[0]-a[0];});
			// set correct value for RTL layout
			options.rtl = (options.rtl) ? false : true;
			// Ajax pagination get same delay on reveal
			options.ajaxDelay = ($pages.length > 0) ? options.itemDelay : options.ajaxDelay;
			// remove all data for security and confidentiality
			var keys = $.map(data, function(value, key) { return key; });
			for (var i = 0; i < keys.length; i++) {
				el.removeAttr('data-' + keys[i]);
			}

        });}

	// ======================================================
	// Custom script (Themeone) : preload img src and/or bg image
	// ======================================================
	
	var tg_img_arr = [];
	
	$.fn.the_grid_images_loaded = function() {
		
		// current element to search in
		var el = $(this);
		
		// extend the options to complete:
		var options = $.extend({
			complete: function() {}
		}, arguments[0] || {});
		
		// init global var
		var count = 0,
			preload = [],
			img_url;
		
		// search all image inside current selector
		el.find('*').filter(function() {
			img_url = $(this).css('background-image');
			img_url = /^url\((['"]?)(.*)\1\)$/.exec(img_url);
			img_url = img_url ? img_url[2] : null;
			img_url = (!img_url && $(this).is('img')) ? $(this).attr('src') : img_url;
			img_url = (img_url && (img_url.match(/\.(jpg|jpeg|png|bmp|gif|tif|tiff|jif|jfif)/g)
					  || img_url.indexOf('external.xx.fbcdn') >= 0
					  || img_url.indexOf('drscdn.500px.org') >= 0)) ? img_url : null;
			if (img_url && $.inArray(img_url, tg_img_arr) == -1) {
				preload.push(img_url);
				tg_img_arr.push(img_url);			
			}
		});

		// load images
		var images = [];

		for (var i = 0; i < preload.length; i++) {
			images[i] = new Image();
			images[i].onload  = imgLoaded;
			images[i].onerror = imgLoaded;
			images[i].onabort = imgLoaded;
			images[i].src = preload[i];
		}
		
		// complete if no images
		if (!preload.length) {
			options.complete.call(el);
			return false;
		}
		
		// on load count and compare to array
		function imgLoaded() {
			count++;
			if(count >= preload.length){
				options.complete.call(el);
				return false;
			}
		}

	};
	
	// ======================================================
	// Custom script (Themeone) : DropDown list (to prevent overflow issue)
	// ======================================================
		
	$(document).ready(function() {

		var $filters,
			animation    = 'tg-dropdown-holder-animation';
			
		if (!tg_is_mobile) {
		
			$(document).on('mouseenter', '.tg-dropdown-holder', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var $this     = $(this),
					listTimer = $($this.data('list-DOM')).data('list-timer');
				
				if (listTimer) {
					clearTimeout(listTimer);
					$this.data('list-DOM').addClass(animation);
					return false;
				}
	
				$filters = $this.find('ul');
				
				var $list = $filters.clone(true).addClass('tg-list-appended').attr('style','').appendTo('body');
				$this.add($list).data('list-DOM', $list);
				$list.data('filter-DOM', $this);
				
				var position = getListPos($this);
					
				$filters.hide();
	
				$list.css({
					'position'  : 'absolute',
					'z-index'   : 99999,
					'width'     : position.width,
					'top'       : position.top,
					'left'      : position.left
				}).addClass(animation);
				
			}).on('mouseleave', '.tg-dropdown-holder', function(e) {
				removeList($(this));
			});
			
			$(document).on('mouseenter touchstart', '.tg-list-appended', function(e) {
				var $this = $(this);
				if ($this.data('list-DOM')) {
					clearTimeout($this.data('list-timer'));
					$this.data('list-DOM').addClass(animation);
					return false;
				}
			}).on('mouseleave touchend', '.tg-list-appended', function(e) {
				removeList($(this));
			});	
			
			$(document).on('click touchstart', '.tg-list-appended li', function(){
				
				var $this    = $(this).closest('ul'),
					$filters = $this.data('filter-DOM');
					
				$filters.find('[data-filter="'+$(this).data('filter')+'"]').trigger('click');
				$filters.find('[data-value="'+$(this).data('value')+'"]').trigger('click');
				$this.width($filters.outerWidth());
				$this.css('left',$filters.offset().left);
				
				var position = getListPos($filters);
	
				if (position.top !== $this.position().top) {
					$this.css('top',position.top);
				} else {
					$this.find('li').removeClass('tg-filter-active');
					$filters.find('.tg-filter-active').each(function(i) {
						$this.find('li').eq($(this).index()).addClass('tg-filter-active');
					});
				}
	
			});

		}
			
		function removeList($this) {
			if ($this.data('list-DOM')) {
				var $list = $this.data('list-DOM').removeClass(animation);
				var timer = setTimeout(function() {
					$list.remove();
					$list = null;
					$this.data('list-DOM', $list);
				},400);
				$($this.data('list-DOM')).data('list-timer', timer);
			}
			return false;
		}
			
		function getListPos(el) {	
			var offset  = el.parent().offset(),
				height  = el.parent().height(),
				body    = ($('body').css('position') === 'relative') ?  $(window).scrollTop()+$('body')[0].getBoundingClientRect().top : null,
				margin  = parseInt(el.css('margin-bottom')),
				width   = el.outerWidth(),
				left    = offset.left,
				top     = offset.top+height-body-margin;
	
			var position   = [];
			position.top   = top;
			position.left  = left;
			position.width = width;
			return position;
		}
		
	});
	
	// ======================================================
	// Custom script (Themeone) : Tooltip (prevent overflow issue)
	// ======================================================
		
	$.fn.TG_ToolTip = function(options) {
		
		/*var settings = $.extend({
            data        : 'tooltip', // Effect Tooltip class name.
			zindex      : 99999,     // z-index css
			place       : 'top',     // Default place.
			appendClass : 'tooltip', // Class to append
			hoverClass  : null,      // Hover class
			spacing     : 0          // Gap between target and Tooltip.
        }, options);*/
		
		var toolTip_Data  = 'tooltip-DOM',
			toolTip_Timer = 'tooltip-timer';
		
		$(document).on('mouseenter', $(this).selector, function() {
			
			var $this = $(this);
			
			if (!$this.data(options.data)) {
				return false;
			}

			if ($this.data(toolTip_Data)) {
				clearTimeout($this.data(toolTip_Timer));
				$this.data(toolTip_Data).addClass(options.hoverClass.split('.').join(''));
				return false;
			}
				
			var $tooltip = $('<div class="'+options.appendClass.split('.').join('')+'"></div>').appendTo('body');
			$this.data(toolTip_Data, $tooltip);

			var data   = $this.data(options.data),
				offset = $this.offset(),
				body    = ($('body').css('position') === 'relative') ? $(window).scrollTop()+$('body')[0].getBoundingClientRect().top : null,
				top    = offset.top - body,
				left   = offset.left,
				width  = $this.outerWidth(true);
				
			$tooltip.html(data).css({
				'position'  : 'absolute',
				'z-index'   : options.zindex,
				'width'     : width,
				'top'       : top+options.spacing-$tooltip.outerHeight(true),
				'left'      : left+width/2
			}).addClass(options.hoverClass.split('.').join(''));
			
		}).on('mouseleave', $(this).selector, function() {
			
			var $this = $(this);
			
			if (!$this.data(options.data) || !$this.data(toolTip_Data)) {
				return false;
			}
			
			var $tooltip = $this.data(toolTip_Data).removeClass(options.hoverClass.split('.').join(''));
			var timer    = setTimeout(function() {
				$tooltip.remove();
				$tooltip = null;
				$this.data(toolTip_Data, $tooltip);
			},400);
			$this.data(toolTip_Timer, timer);
			
		});
		
	};
	
	$(document).ready(function() {
		$('.tg-filter-name').TG_ToolTip({
			data        : 'tooltip',
			zindex      : 99999,
			place       : 'top',
			appendClass : '.tg-filter-tooltip',
			hoverClass  : '.tg-tooltip-hover',
			spacing     : -2
		});	
	});
			
	// ======================================================
	// Handle media content (html-audi/html-video/Youtube/Vimeo/SoundCloud/Wistia) in the grid
	// ======================================================
	
	var tg_media_init = 'tg-media-init',
		tg_media_hold = '.tg-item',
		ie = (function() { // ie version detection
			var v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');
			do {div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';}
			while (all[0]);
			return v > 4 ? v : document.documentMode; 		
		}());

	if (ie) {
		$('body').addClass('is-ie');
	}
	
	// SoundCloud players (API)
	$.fn.TG_SoundCloud = function() {
		
		return this.each(function () {
			
			var $this = $(this).closest(tg_media_hold),
				src   = $(this).attr('src');
			
			if (!$this.hasClass(tg_media_init) && src !== 'about:blank') {

				var player = SC.Widget($(this).attr('id'));
				
				player.bind(SC.Widget.Events.READY, function() {
				
					if ((!player.getCurrentSound && tg_is_mobile) || !tg_is_mobile) {
						player.play();
					}
					
					$.TG_Media_Ready($this,player,'STD');
				
					/*player.bind(SC.Widget.Events.PLAY,function() {
						//$.TG_Media_Play($this);
					});*/
						
					player.bind(SC.Widget.Events.PAUSE,function() {
						$.TG_Media_Pause($this);
					});
						
					player.bind(SC.Widget.Events.FINISH,function() {
						$.TG_Media_Pause($this);
					});
				
				});
			
			}
			
		});
		
	};
	
	//object to hold all players on the page
	var TG_YT_players = {};
	// Youtube players (API)
	$.fn.TG_Youtube = function() {
		
		return this.each(function () {
	
			var $this = $(this).closest(tg_media_hold),
				src   = $(this).attr('src');
			
			if (!$this.hasClass(tg_media_init) && src !== 'about:blank') {
	
				var playerID = this.id;

				TG_YT_players[playerID] = new YT.Player(playerID, {
					events: {
						'onReady':function(event){
							if (!tg_is_mobile) {
								event.target.playVideo();
							}
							$.TG_Media_Ready($this,event.target,'YT'); 
						},
						'onStateChange': function(event){
							if (event.data === 1) {
								$.TG_Media_Play($this);
							}
							if (event.data === 2 ||  event.data === 0) {
								$.TG_Media_Pause($this);
							}
						}
					}
				});
											
			}
			
		});
		
	};
	
	// Vimeo players (API)
	$.fn.TG_Vimeo = function() {
		
		return this.each(function () {

			var $this = $(this).closest(tg_media_hold),
				src   = $(this).attr('src');
				
			// Vimeo not supported with IE <= 9, so remove iframe & play button
			if (ie <= 9) {
				$(this).remove();
				$this.find('.tg-media-button').remove();
			}

			if (!$this.hasClass(tg_media_init) && src !== 'about:blank') {
				
				// reset the src of the iframe because of a cache issue from VIMEO API
				$(this).attr('src', $(this).attr('src'));

				var player = $f(this);

				player.addEvent('ready', function() {
					if (!tg_is_mobile) {
						player.api('play');
					}
					$.TG_Media_Ready($this,player,'VM');
					player.addEvent('play', function(){
						$.TG_Media_Play($this);
					});
					player.addEvent('pause', function(){
						$.TG_Media_Pause($this);
					});
					player.addEvent('finish', function(){
						$.TG_Media_Pause($this);
					});
				});

				/*$(this).attr('src', $(this).attr('src'));
				var player = new Vimeo.Player($(this));
				
				player.play();
				$.TG_Media_Ready($this,player,'STD');
				player.on('play', function(){
					$.TG_Media_Play($this);
				});
				player.on('pause', function(){
					$.TG_Media_Pause($this);
				});
				player.on('finish', function(){
					$.TG_Media_Pause($this);
				});*/
				
			}
				
		});
	};
	
	// Wistia players (API)
	$.fn.TG_Wistia = function() {
		
		return this.each(function () {
	
			var $this = $(this).closest(tg_media_hold),
				src   = $(this).attr('src');
			
			if (!$this.hasClass(tg_media_init) && src !== 'about:blank') {
				
				$(this).load(function() {
				
					var player = $(this)[0].wistiaApi,
						is_init = false,
						seeking = false,
						heightchange = false;
					
					
					$.TG_Media_Ready($this,player,'STD');
					
					// prevent issue with Visual Composer on Front-End mode
					if (player) {
						
						player.play();
					
						player.bind('seek', function () {
							seeking = true;
						});
						
						player.bind('heightchange', function () {
							heightchange = true;
						});
						
						player.bind('play', function () {
							// because of play trigger by seek...
							if (seeking === false && heightchange === false && is_init) {
								$.TG_Media_Play($this);
							}
							seeking = heightchange = false;
						});
		
						player.bind('pause', function () {
							// because of pause trigger by seek...
							if (seeking === false && heightchange === false) {
								$.TG_Media_Pause($this);
							}
							heightchange = is_init = true;
						});
						
						player.bind('finish', function () {
							$.TG_Media_Pause($this);
						});
						
					}
				
				});
											
			}
			
		});
	};

	// HTML5 video/audio players
	$.fn.TG_HTML_Player = function() {
		
		return this.each(function () {
			
			var $this = $(this).closest(tg_media_hold);
			
			if (!$this.hasClass(tg_media_init)) {
				
				var player = $(this)[0];
				
				if (player.addEventListener) {
					$.TG_Media_Ready($this,player,'STD');
					player.addEventListener('play', function(){
						$.TG_Media_Play($this);
					});
					player.addEventListener('pause', function(){
						$.TG_Media_Pause($this);
					});
					player.addEventListener('ended', function(){
						$.TG_Media_Pause($this);
					});
				}
			}
			
		});
		
	};
	
	// Set player on ready
	$.TG_Media_Ready = function(el,player,method) {
		el.data('pause-method',method)
		  .data('media-player',player)
		  .addClass(tg_media_init);  
	};
	
	// handle Play on player
	$.TG_Media_Play = function(el) {
		if (!el.hasClass('tg-force-play')) {
			$.TG_Pause_Players();
		}
		el.addClass('tg-is-playing');
		$(tg_media_hold).removeClass('tg-force-play');
	};
	
	// handle Pause on player
	$.TG_Media_Pause = function(el) {
		el.removeClass('tg-is-playing tg-force-play');
	};
	
	// detect fullscreen player mode (prevent to add undesired css transform)
	$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(e){
		var el = $(e.target);
		$('.tg-item-media').removeClass('tg-item-media-fullscreen');
		if (el && el.hasClass('tg-item-media')) {
			el.addClass('tg-item-media-fullscreen');
		}
	});
	
	// on first play build iframe and init script
	$(document).on('click', '.tg-item:not(.tg-media-init) .tg-item-button-play', function(e) {

		e.preventDefault();
		
		var $this     = $(this).closest('.tg-item'),
			$media    = $this.find('iframe');

		$media.attr('src', $media.data('src'));
		$.TG_Pause_Players();
		$.TG_media_init();
		$this.addClass('tg-force-play');

	});
	
	// Play button
	$(document).on('click', '.tg-item.tg-media-init .tg-item-button-play', function(e) {

		e.preventDefault();
		
		var $this  = $(this).closest('.tg-item'),
			method = $this.data('pause-method'),
			player = $this.data('media-player');

		// pause and return if media is playing
		if ($this.is('.tg-force-play, .tg-is-playing')){
			$.TG_Pause_Players();
			return false;
		}

		// check if player & init, and play
		if (player && $this.hasClass(tg_media_init)) {
			$this.find('.tg-item-media').show();
			$.TG_Pause_Players();
			$(tg_media_hold).removeClass('tg-force-play tg-play-error');
			$this.addClass('tg-force-play');
			switch(method) {
				case 'STD':
					// prevent auto play SoundCloud on mobile (force manual play to work)
					if ((!player.getCurrentSound && tg_is_mobile) || !tg_is_mobile) {
						player.play();
					}
					break;
				case 'YT':
					player.playVideo();
					break;
				case 'VM':
					player.api('play');
					break;
			}
		}
		
	});

	// Pause all kind of video/audio media
	$.TG_Pause_Players = function() {
		
		$('.tg-item.tg-is-playing, .tg-item.tg-force-play').each(function() {
			var $this  = $(this),
				method = $this.data('pause-method'),
				player = $this.data('media-player');
			if (player && $this.hasClass(tg_media_init)) {
				switch(method) {
					case 'STD':
						player.pause();
						break;
					case 'YT':
						player.pauseVideo();
						break;
					case 'VM':
						player.api('pause');
						break;
				}
				$this.closest(tg_media_hold).removeClass('tg-is-playing tg-force-play');
			}
		});
	};

	// API scripts (Youtube, Vimeo, Soundclound)
	$.TG_media_init = function() {
		
		var tag,
			API,
			url,
			type,
			script,
			scripts = [
				{'ID':'youtube', 'url':'//www.youtube.com/iframe_api'},
				{'ID':'vimeo', 'url':'//f.vimeocdn.com/js/froogaloop2.min.js'},
				{'ID':'soundcloud', 'url':'//w.soundcloud.com/player/api.js'},
				{'ID':'wistia', 'url':'//fast.wistia.com/assets/external/E-v1.js'}
			];
		
		// load Youtube subscribe button script
		if ($('.g-ytsubscribe').length) {
			tag = document.createElement('script');
			tag.src = 'https://apis.google.com/js/platform.js';
			tag.id  = 'tg-youtube-subscribe-api';
			script = document.getElementsByTagName('script')[0];
			script.parentNode.insertBefore(tag, script);
		}
		
		if ($('.tg-item-media').length === 0) {
			return false;
		}
		
		API = {
			youtube: function () {
				// because of futur ajax events
				if (typeof YT == 'undefined' || YT.loaded === 0) {
					window.onYouTubeIframeAPIReady = function() {
						$('[data-api="1"].tg-item-youtube').TG_Youtube();
					};
				} else {
					$('[data-api="1"].tg-item-youtube').TG_Youtube();
				}
			},
			vimeo: function() {
				$('[data-api="1"].tg-item-vimeo').TG_Vimeo();
			},
			soundcloud: function() {
				$('[data-api="1"].tg-item-soundcloud').TG_SoundCloud();
			},
			wistia: function() {
				$('[data-api="1"].tg-item-wistia').TG_Wistia();
			}
		};
		
		/* jshint loopfunc:true */
		// autoload API scripts (only when necessary)
		for (var i = 0; i < scripts.length; i++) {
			type = scripts[i].ID;
			if ($('[data-api="1"].tg-item-'+type).length > 0) {
				url  = scripts[i].url;
				if ($('#tg-'+type+'-api').length === 0) {
					tag = document.createElement('script');
					tag.src = scripts[i].url;
					tag.id  = 'tg-'+type+'-api';
					script  = document.getElementsByTagName('script')[0];
					script.parentNode.insertBefore(tag, script);
					(function(tag,type){
						tag.onload = function() {
							API[type]();
						};
					})(tag,type);
				} else {
					API[type]();
				}
			}
		}

		// HTML5 Player events
		$(document).ready(function() {
			$('.tg-item .tg-item-audio-player').attr('width','100%');
			$('.tg-item-video-player,.tg-item-audio-player').TG_HTML_Player();
			if (tg_global_var.mediaelement) {
				$('.tg-item-video-player:not(.tg-mediaelement-init), .tg-item-audio-player:not(.tg-mediaelement-init)').mediaelementplayer({
					audioVolume: 'vertical',
					videoVolume: 'vertical',
					features: ['playpause', 'current', 'progress', 'duration', 'volume', 'fullscreen' ],
					startVolume: 0.8
				});	
				$('.tg-item-video-player, .tg-item-audio-player').addClass('tg-mediaelement-init');
			}
		});

	};
	
	// destroy all video/audio players 
	$.TG_media_destroy = function(el) {

		var vimeo = (el) ? el : $('.tg-item');
		// destroy Vimeo, needed for IE
		vimeo.find('.tg-item-vimeo').each(function() {
			var $this = $(this),
				player = $this.closest(tg_media_hold).data('media-player');
			if (player) {
				player.api('pause');
				$this.attr('src','about:blank');
			}
		});
		
		el = (el) ? el.find('.tg-item video, .tg-item audio') : $('.tg-item video, .tg-item audio');
		// destroy media player
		el.each(function() {
						
			var $media = $(this),
				player = $media.data('mediaelementplayer');
				
			$media.closest(tg_media_hold).removeClass('tg-force-play tg-is-playing');
				
			if ($media.length) {
				if (player) {
					player = $media.data('mediaelementplayer');
					player.pause();
					player.setSrc('about:blank');
					$media.children('source').prop('src', '');
					player.remove();
				} else {
					$media[0].pause();
					$media[0].src = 'about:blank';
					$media.children('source').prop('src', '');
					$media.remove().length = 0;
				}
			}
						
		});
		
		// delete all instances of mediaelement.js
		if (tg_global_var.mediaelement) {
			mejs.players = [];
		}
			
	};

	// ======================================================
	// Themeone Lightbox (image/video)
	// ======================================================

	$.TO_Lightbox = function() {
	
		var TO_LB_Markup = '<div class="tolb-holder">'+
								'<div class="tolb-loader"></div>'+
									'<div class="tolb-inner">'+
									'<figure>'+
										'<div class="tolb-close tg-icon-close"></div>'+
										'<div class="tolb-content"></div>'+
										'<figcaption>'+
											'<div class="tolb-title"></div>'+
											'<div class="tolb-counter"></div>'+
										'</figcaption>'+
									'</figure>'+
								'</div>'+
								'<div class="tolb-prev"><i class="tg-icon-arrow-prev-thin"></i></div>'+
								'<div class="tolb-next"><i class="tg-icon-arrow-next-thin"></i></div>'+
							'</div>',
			func,
			player,
			media_id,
			media_lb,
			media_src,
			media_alt,
			media_html,
			media_type,
			media_poster,
			media_length,
			media_arr  = [],
			media_data = '[data-tolb-src]:not(.tolb-disabled)',
			holder  = '.tolb-holder',
			inner   = '.tolb-inner',
			content = '.tolb-content',
			video   = '.tolb-video',
			image   = '.tolb-img',
			title   = '.tolb-title',
			counter = '.tolb-counter',
			next    = '.tolb-next',
			prev    = '.tolb-prev',
			close   = '.tolb-close',
			index   = 'tolb-index',
			open    = 'tolb-open',
			ready   = 'tolb-ready',
			loading = 'tolb-loading',
			iframe  = 'tolb-iframe',
			autoplay = tg_global_var.lightbox_autoplay;

		function checkLightbox() {
			var $media_data = $(media_data).filter(':visible');
			media_length = $media_data.length;
			for (i = 0; i < media_length; i++) {
				var el = $media_data.eq(i);
				media_arr[i] = {};
				media_arr[i].type   = el.data('tolb-type');
				media_arr[i].src    = el.data('tolb-src');
				media_arr[i].alt    = el.data('tolb-alt');
				media_arr[i].poster = el.data('tolb-poster');
				el.data(index,i);
			}
			if (media_length > 1) {
				$(next+','+prev).show();
			} else {
				$(next+','+prev).hide();
			}
		}
		
		function getMedia(el) {
			$(holder).addClass(open+' '+loading);
			media_id   = el.data(index);
			media_type = media_arr[media_id].type;
			media_src  = media_arr[media_id].src;
			media_alt  = media_arr[media_id].alt;
			updateIndex();
			switch(media_type) {
				case 'image':
					media_html = $('<img class="tolb-img" src="'+media_src+'" alt="'+media_alt+'"></img>');
					media_lb = new Image();
					media_lb.onload  = load_image;
					media_lb.onerror = load_image;
					media_lb.src = media_src;
					break;
				case 'youtube':
					media_src  = '//www.youtube.com/embed/'+media_src+'?html5=1&controls=1&autohide=1&rel=0&showinfo=0&autoplay='+autoplay;
					media_html = $('<iframe class="tolb-video" src="'+media_src+'" allowfullscreen></iframe>');
					load_iframe();
					break;
				case 'vimeo':
					media_src  = '//player.vimeo.com/video/'+media_src+'?title=0&amp;byline=0&amp;portrait=0&amp;autoplay='+autoplay;
					media_html = $('<iframe class="tolb-video" src="'+media_src+'" allowfullscreen></iframe>');
					load_iframe();
					break;
				case 'wistia':
					media_src  = '//fast.wistia.net/embed/iframe/'+media_src+'?title=0&amp;byline=0&amp;portrait=0&amp;autoPlay='+autoplay;
					media_html = $('<iframe class="tolb-video" src="'+media_src+'" allowfullscreen></iframe>');
					load_iframe();
					break;
				case 'video':
					var source = '';
					for(var i=0; i<media_src.length ;i++){
						source += '<source src="'+media_src[i][0].source+'" type="video/'+media_src[i][0].type+'" width="100%" height="100%"></source>';
					}
					media_poster = media_arr[media_id].poster;
					media_poster = (media_poster) ? ' poster="'+media_poster+'"' : '';
					var attribute = (autoplay) ? ' autoplay' : '';
					media_html   = $('<video class="tolb-video" controls'+media_poster+attribute+' width="100%">'+source+'</video>');
					load_video();
					break;
			}
		}

		function unloadMedia() {
			var iframe = $(holder).find('iframe').not(media_html);
			if (iframe.length > 0) {
				iframe.attr('src','about:blank').one('load',function(){
					appendMedia();
				});
			} else {
				appendMedia();
			}
		}
		
		function appendMedia() {
			$(holder).addClass(ready);
			func = (media_type !== 'iframe') ?  $(content).html('') : $(content).find('*').not(media_html).remove();
			func = (media_type !== 'image') ? $(holder).addClass(iframe) : $(holder).removeClass(iframe);
			func = (media_type !== 'iframe') && $(content).append(media_html);
			maxHeight();
			updateCaption();
			media_html.show();
			$(holder).removeClass(loading);	
		}
		
		function load_image() {
			unloadMedia();
		}
		
		function load_video() {
			if (!tg_is_mobile) {
				media_html.one('loadeddata',function() {
					func = (player) && player.setSrc('about:blank');
					if (tg_global_var.mediaelement) {
						mediaelement();
					} else {
						unloadMedia();
					}
				});
				media_html[0].addEventListener('error', function(){
					updateCaption();
					$(holder).removeClass(loading);
				});
			} else {
				func = (player) && player.setSrc('about:blank');
				unloadMedia();
			}
		}
		
		function load_iframe() {
			media_type = 'iframe';
			$(content).append(media_html.hide());
			media_html.one('load',function (){
				unloadMedia();
			});
		}
		
		function mediaelement() {
			media_html.mediaelementplayer({
				features: ['playpause', 'stop', 'loop', 'current', 'progress', 'duration', 'volume', 'fullscreen'],
				videoVolume: 'horizontal',
				startVolume: 0.8,
				success: function(media, domObject) {
					player = media;
					media_html = $(domObject).closest('.mejs-container');
					unloadMedia();
					player.addEventListener('ended', function(){
						media_html.find('.mejs-poster').show();
					});
				}	
			});
		}
		
		function maxHeight() {
			$(image).css('max-height',$(window).height()-80-$('#wpadminbar').height());
		}
		
		function updateCaption() {
			$(title).text(media_alt);
			$(counter).text(media_id+1+'/'+media_length);
		}
		
		function updateIndex() {
			$(prev).data(index,checkIndex(media_id-1));
			$(next).data(index,checkIndex(media_id+1));
		}
		
		function checkIndex(media_id) {
			return (media_length + (media_id % media_length)) % media_length;
		}
		
		function close_lightbox() {
			$(holder).removeClass(open+' '+loading+' '+ready);
			setTimeout(function(){
				if ($(holder).find('iframe').length > 0) {
					$(holder).find('iframe').attr('src','about:blank').one('load', function(){
						$(content).html('');
					});
				} else {
					$(content).html('');
				}
			}, 300);
		}
		
		$(window).on('resize', function(){
			maxHeight();	
		});
		
		$(document).on('click', media_data, function(e) {
			e.preventDefault();	
			$.TG_Pause_Players();
			$(video+','+image).remove();
			checkLightbox();
			getMedia($(this));
			return false;
		});
	
		$(document).on('click touchend',next+','+prev, function() {
			getMedia($(this));
			return false;
		});
		
		$(document).on('keydown', throttle(function(e) {
			if ($(holder).hasClass(open)) {
				if (e.keyCode == 37) {
					$(prev).trigger('click');
				} else if(e.keyCode == 39) {
					$(next).trigger('click');
				} else if(e.keyCode == 27) {
					close_lightbox();
				}
			}
		},300));
		
		$(document).on('click touchend',inner+','+close, function(e) {
			e.stopPropagation();
			if ($(e.target).is(inner) || $(e.target).is(close)) {
				close_lightbox();
			}
			return false; 
		});
		
		$('body').append($(TO_LB_Markup));
	
	};

	// auto click lightbox (prevent duplicate content)
	$(document).on('click', '[data-tolb-id]', function(e) {
		e.preventDefault();
		var id = $(this).data('tolb-id');
		if (id) {
			$('#'+id).trigger('click');
		}
	});

	// ======================================================
	// Custom panZoom/Apple TV Effects
	// ======================================================
	
	function TG_PanZoom(){	

		var el,offset,h,w,x,y,
			edge = window.navigator.userAgent.indexOf('Edge/'),
			supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints,
			image = 'div:not(.tg-item-gallery-holder) > .tg-item-image, .tg-item-media-poster, .tg-item-audio-poster, .tg-item-gallery-holder',
			sensitivity = 0.4,
			lastMove = 0;

		if (!supportsTouch && !$('body').hasClass('is-ie') && edge < 0) {
				
			$(document).on('mousemove', '.tg-panZ', function(e){
				el = $(this);
				w = el.width();
				h = el.height();
				offset = el.closest('.tg-item').offset();
				var now = Date.now();
				if (now > lastMove + 80) {
					lastMove = now;
					window.requestAnimationFrame(function(){
						x = -(e.pageX - offset.left-w/2)*0.08*sensitivity;
						y = -(e.pageY - offset.top-h/2)*0.08*sensitivity;
						$(e.target).closest('.tg-item').find(image).css({
							'-webkit-transform': 'matrix(1.08, 0, 0, 1.08,'+x+','+y+')',
							'-moz-transform': 'matrix(1.08, 0, 0, 1.08,'+x+','+y+')'
						});
					});
				}
			}).on('mouseleave', '.tg-panZ', function(e){
				setTimeout(function(){
					$(e.target).closest('.tg-item').find(image).css({
						'-webkit-transform':'',
						'-moz-transform':''
					});
				}, 80);
			});
			
		}
	
	}
	// Init PanZoom effect
	TG_PanZoom();

	
	// Apple Tv effect
	function TG_atv(){
	
		var d = document,
			lastMove = 0,
			htm = d.getElementsByTagName('html')[0],
			bd  = d.getElementsByTagName('body')[0],
			supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints,
			eventThrottle = $('body').hasClass('is-ie') ? 1 : 80;
		
		if (!supportsTouch) {
			$(document).on('mousemove', '.tg-atv-anim', function(e){
				var holder = $(this),
					now = Date.now();
				if (now > lastMove + eventThrottle) {
					lastMove = now;
					window.requestAnimationFrame(function(){
						processMovement(e,holder);	
					});
				}	
			}).on('mouseenter', '.tg-atv-anim', function(e){
				processEnter($(this));		
			}).on('mouseleave', '.tg-atv-anim', function(e){
				processExit($(this));	
			});
		}
	
		function processMovement(e, layers){
			
			var bdst  = bd.scrollTop || htm.scrollTop,
				bdsl  = bd.scrollLeft,
				pageX = e.pageX,
				pageY = e.pageY,
				offsets = layers[0].getBoundingClientRect(),
				w = layers[0].clientWidth || layers[0].offsetWidth || layers[0].scrollWidth,
				h = layers[0].clientHeight || layers[0].offsetHeight || layers[0].scrollHeight,
				wMultiple = 320/w,
				offsetX = 0.52 - (pageX - offsets.left - bdsl)/w,
				offsetY = 0.52 - (pageY - offsets.top - bdst)/h,
				dy = (pageY - offsets.top - bdst) - h / 2,
				dx = (pageX - offsets.left - bdsl) - w / 2,
				yRotate = (offsetX - dx)*(0.07 * wMultiple),
				xRotate = (dy - offsetY)*(0.1 * wMultiple),
				ratio = (h > w) ? h/w*2 : 1,
				perspective = w*3*ratio,
				imgCSS = 'perspective('+ perspective +'px) rotateX(' + xRotate + 'deg) rotateY(' + yRotate + 'deg) scale3d(1.03,1.03,1.03)';

			layers.css('transform',imgCSS + ' ' + 'translateX(' + (offsetX * 2) * ((1 * 2.5) / wMultiple) + 'px) translateY(' + (offsetY * 1) * ((1 * 2.5) / wMultiple) + 'px)');
	
		}
	
		function processEnter(elem){
			elem.addClass('over');
		}
	
		function processExit(elem){
			elem.removeClass('over');
			setTimeout(function(){
				var w = elem[0].clientWidth || elem[0].offsetWidth || elem[0].scrollWidth;
				elem.css('transform','perspective('+ w*3 +'px) rotateX(0deg) rotateY(0deg) translateZ(0)');
			}, 80);
		}
	
	}
	// Init Apple TV parallax effect
    TG_atv();

	// ======================================================
	// Social share links
	// ======================================================

	$(document).on('click', '.tg-social-share:not(.tg-social-disabled)', function(e){
		
		e.preventDefault();
		
		var href = $(this)[0].href,
			left = Math.round(window.screenX + (window.outerWidth - 626) / 2),
			top  = Math.round(window.screenY + (window.outerHeight - 436) / 2);

		if (href) {
			window.open(href, 'tg_share', 'status=0,resizable=1,location=1,toolbar=0,width=626,height=436,top='+top+',left='+left);
		}
		
		return false;
		
	});

	// ======================================================
	// Init The Grid Plugin
	// ======================================================
	
	$.TG_media_init();
	// Initializing
	$(document).ready(function() {
		// because of @keyframe and @font-face issue in Firefox
		$('.tg-grid-preloader-styles, .tg-grid-styles').removeAttr('scoped');
		$('.tg-grid-holder').The_Grid();
		$.TO_Lightbox();	
	});

	// ======================================================
	// Helpers
	// ======================================================

	// debounced resize
	var $event = $.event,
		$special,
		func,
		resizeTimeout;
	
	$special = $event.special.debouncedresize = {
		setup: function() {
			$(this).on( "resize", $special.handler );
		},
		teardown: function() {
			$(this).off( "resize", $special.handler );
		},
		handler: function( event, execAsap ) {
			// Save the context
			var context = this,
				args = arguments,
				dispatch = function() {
					// set correct event type
					event.type = "debouncedresize";
					$event.dispatch.apply( context, args );
				};
	
			if ( resizeTimeout ) {
				clearTimeout( resizeTimeout );
			}
	
			func = execAsap ? dispatch() : resizeTimeout = setTimeout( dispatch, $special.threshold );
		},
		threshold: 100
	};

})(jQuery);

// throttle function to reduce calculations
function throttle(func, milliseconds) {
	var lastCall = 0;
	return function () {
		var now = Date.now();
		if (lastCall + milliseconds < now) {
			lastCall = now;
			return func.apply(this, arguments);
		}
	};
}

// debounce so filtering doesn't happen every millisecond
function debounce(fn, threshold) {
	
	"use strict";
	
	var timeout;
	
	return function debounced() {
		if (timeout) {
			clearTimeout(timeout);
		}
		function delayed() {
			fn();
			timeout = null;
		}
		setTimeout(delayed, threshold || 100);
	};
}

//RAF polyfill (http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// RAF interval for smooth animations
window.tgInterval = function(a, b) {
    var c = Date.now,
        d = window.requestAnimationFrame,
        e = c(),
        f, g = function() {
            c() - e < b || (e += b, a());
            f || d(g);
        };
    d(g);
    return {
        clear: function() {
            f = 1;
        }
    };
};
