
(function(jQuery) {

    jQuery.fn.kenBurning = function(options) {
        var defaults = {
                time: 6000
            },
            settings = jQuery.extend(defaults, options),
            $container = jQuery(this),
            animation = "in";
        jQuery(function() {
            $container.addClass("kenburning-container");
            jQuery.fn.kenBurning.doIt();
            kenBurningplay = setInterval("jQuery.fn.kenBurning.doIt()", settings.time);

        });

        if(jQuery('.modern-slider-wrap').length){
            jQuery.fn.kenBurning.doIt = function() {
                var $active = $container.find(".item-mod.active");
                if ($active.length === 0) {
                    $active = $container.find(".item-mod:last");
                }
                var $next = $active.next().length ? $active.next() : $container.find(".item-mod:first");
                $active.addClass("last-active").removeClass("active").find('.img').removeClass('').css("transform","");
                if (animation === "in") {
                    $next.css({
                        left: "0",
                        right: "auto"
                    }).find('.img').addClass("").css("transform", "").parent('.item-mod').addClass("active");
                    setTimeout(function() {
                        $active.removeClass("last-active");
                    }, settings.time);
                    animation = "out";
                } else {
                    $next.css({
                        left: "auto",
                        right: "0"
                    }).find('.img').addClass("").css("transform", "").parent('.item-mod').addClass("active");
                    setTimeout(function() {
                        $active.removeClass("last-active");
                    }, settings.time);
                    animation = "in";
                }
            };




        }
        else if(jQuery('.kenburns-wrap').length){

            var number = jQuery('.kenburns-wrap').find(".item-ken").length;
            var count = 2;
            if ( number % 2 ) {
                count = 1;
            }

            jQuery.fn.kenBurning.doIt = function() {
                var $active = $container.find(".item-ken.active");
                if ($active.length === 0) {
                    $active = $container.find(".item-ken:last");
                }
                var $next = $active.next().length ? $active.next() : $container.find(".item-ken:first");

                $active.addClass("last-active").removeClass("active").find('.img').removeClass('zoomout zoomin').css("transform","");
                if (animation === "in") {
                    $next.css({
                        left: "0",
                        right: "auto"
                    }).find('.img').addClass("zoomin").css("transform", "scale(1.2)").parent('.item-ken').addClass("active");
                    setTimeout(function() {
                        $active.removeClass("last-active");
                        if( count === 1){
                            $active.find('.img').addClass("zoomout").removeClass("zoomin").css("transform", "scale(1)").parent('.item-ken');
                        }
                    }, settings.time);
                    animation = "out";
                } else {
                    $next.css({
                        left: "auto",
                        right: "0"
                    }).find('.img').addClass("zoomout").css("transform", "scale(1)").parent('.item-ken').addClass("active");
                    setTimeout(function() {
                        $active.removeClass("last-active")
                        if( count === 1){
                            $active.find('.img').addClass("zoomin").removeClass("zoomout").css("transform", "scale(1.2)").parent('.item-ken');
                        }
                    }, settings.time);
                    animation = "in";
                }
            };
        }


    };


    jQuery(".kenburns-wrap").each(function() {
        jQuery(this).on("click", function() {

            var time = jQuery(this).find('.kenburns').attr('data-time') ? jQuery(this).find('.kenburns').attr('data-time') : 6000;

            if (jQuery(this).find('.kenburns-play').hasClass("pause")) {
                clearInterval(kenBurningplay);
            } else {
                jQuery.fn.kenBurning.doIt();
                kenBurningplay = setInterval("jQuery.fn.kenBurning.doIt()", time );
            }
            jQuery(this).find('.kenburns-play').toggleClass("pause");
            jQuery(this).toggleClass("pause");
        });
    });
})(jQuery);



(function ($, window, document, undefined) {

    if($('.kenburns').length){
        $('.kenburns').each(function () {
            var time = $(this).attr('data-time') ? $(this).attr('data-time') : 6000;
            $(this).kenBurning({
                time : time
            });

        });
    }

    var _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

// for sound bg
  $('.wiso-sound-btn').on('click',function(){

    var $button = $(this);
    if ($button.hasClass('play')) {
      $button.next('audio').trigger('pause');
      $button.removeClass('play');
    } else {
      $button.next('audio').trigger('play');
      $button.addClass('play');
    }

  });

    function kenburnsHeight() {
        if($('.kenburns-wrap').length){
            $('.kenburns-wrap').each(function () {
                var headerH = $('.header_top_bg').not('.header_trans-fixed').outerHeight() || 0,
                    footerH = $('#footer').not('.fix-bottom').outerHeight() || 0,
                    sliderH = $(window).height() - (headerH + footerH),
                    bottomplay = $('#footer').hasClass('fix-bottom') ? ($('#footer').outerHeight() + 60) : 30;

              $(this).find('.kenburns-play').css('bottom', bottomplay + 'px');
                $(this).find('.wiso-sound-btn').css('bottom', bottomplay + 'px');
                $(this).find('.but-eye-wrap').css('bottom', bottomplay + 40 + 'px');

                $(this).css('height', sliderH + 'px');

                if($(window).width() < 768 && _ismobile){
                    $(this).find('.wiso-sound-btn').css('bottom', bottomplay - 50 + 'px');
                    $(this).find('.but-eye-wrap').css('bottom', bottomplay - 10 + 'px');
                    $(this).find('.caption').css('bottom', bottomplay - 30 + 'px');
                }else{
                    $(this).find('.caption').css('bottom', bottomplay - 20 + 'px');
                    $(this).find('.wiso-sound-btn').css('bottom', bottomplay + 'px');
                    $(this).find('.but-eye-wrap').css('bottom', bottomplay + 40 + 'px');
                }

            });
        }
    }

    $('.but-eye-wrap').on('click', function () {
        var mobWidth = $('.main-wrapper').attr('data-top');
        $('.but-eye-wrap').toggleClass('active');
        if( $('.but-eye-wrap').hasClass('active')){
            $('#topmenu, .kenburns-wrap .caption, #footer, .about-mob-section-wrap, header .logo').show();

            if($(window).width() > mobWidth){
                $('.mob-nav').hide();
            }else{
                $('.mob-nav').show();
            }

        }else{
            $('#topmenu, .mob-nav, .kenburns-wrap .caption, #footer, .about-mob-section-wrap').hide();

            if($(window).width() > mobWidth){
                $('header .logo').hide();
            }else{
                $('header .logo').show();
            }
        }
    });

    function playSound() {

        var mobWidth = $('.main-wrapper').attr('data-top');

        if($('.but-eye-wrap:not(.active)').length){
            $('#topmenu, .mob-nav, .kenburns-wrap .caption, #footer, .about-mob-section-wrap').hide();
            if($(window).width() > mobWidth){
                $('header .logo').hide();
            }else{
                $('header .logo').show();
            }
        }

        if ($('.wiso-sound-btn').length && $('.wiso-sound-btn').hasClass('play')) {
            $('.wiso-sound-btn').next('audio').trigger('play');
        }
    }

    $(window).on('load', function () {
        playSound();
    });

    $(window).on('load resize orientationchange', function () {
        setTimeout(kenburnsHeight, 0);
    });


})(jQuery, window, document);

;(function ($, window, document, undefined) {
  'use strict';

  if($('.modern-slider-wrap').length){
    $('.modern-slider').each(function () {
      var time = $(this).attr('data-time') ? $(this).attr('data-time') : 6000;
      $(this).kenBurning({
        time : time
      });
    });
  }

})(jQuery, window, document);