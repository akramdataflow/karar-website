;(function($, window, document, undefined) {
    'use strict';


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

    window.addEventListener("resize", function () {
        var daccaEl = document.querySelectorAll('.dacca');
        
        for ( var i = 0; i <daccaEl.length; i++) {
            var futureHeight = daccaEl[i].offsetWidth/100 * 65;
            daccaEl[i].style.height = futureHeight + 'px';
        }
    });
    window.addEventListener("load", autoHeight );
    window.addEventListener("resize", autoHeight );

	function autoHeight () {
        var daccaEl = document.querySelectorAll('.dacca');
        
        for ( var i = 0; i <daccaEl.length; i++) {
            var futureHeight = Math.ceil(daccaEl[0].offsetWidth/100 * 64);
			daccaEl[i].style.height = futureHeight + 'px';
        }
    }

})(jQuery, window, document);