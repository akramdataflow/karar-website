;(function ($, window, document, undefined) {
    'use strict';
    $(window).on('load resize', function() {
        var winWidth = window.innerWidth,
            slideWidth;
        if (winWidth > 768) {
            slideWidth = winWidth*0.65;
        } else {
            slideWidth = winWidth;
        }

        if($('.portfolio-slider-wrap.urban_slider').length){
            $('.gallery-top-slide').width(slideWidth);
        }

        if($('.swiper-album').length) {
          var albumHeight =  window.innerHeight - $('header').outerHeight() - $('#wpadminbar').outerHeight();
          $('.swiper-album').css('height', albumHeight);
          if ($('header').hasClass('aside-menu')) {
            $('.swiper-album').addClass('with-aside-menu');
          }
        }
    });


    if($('.portfolio-slider-wrap.urban_slider').length){

        $('.gallery-top').each(function () {
            var autoplaySpeed = $(this).data('autoplayspeed'),
                autoplay = $(this).data('autoplay'),
                speed = $(this).data('speed'),
                id = '#' + $(this).data('id');

            $(this).slick({
                slidesToShow: 1,
                autoplay: autoplay,
                slidesToScroll: 1,
                arrows: true,
                speed: speed,
                autoplaySpeed: autoplaySpeed,
                infinite: true,
                asNavFor: id,
                centerMode: true,
                centerPadding: '30px',
                variableWidth: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>',
                cssEase: 'ease'
            });
        });

        $('.gallery-thumb').each(function () {
            var autoplaySpeed = $(this).data('autoplayspeed'),
                autoplay = $(this).data('autoplay'),
                id = '#' + $(this).data('id'),
                speed = $(this).data('speed');

            $(this).slick({
                slidesToShow: 3,
                autoplay: autoplay,
                slidesToScroll: 1,
                infinite: true,
                speed: speed,
                arrows: false,
                autoplaySpeed: autoplaySpeed,
                asNavFor: id,
                centerMode: true,
                centerPadding: '30px',
                focusOnSelect: true,
                cssEase: 'ease',
                responsive: [
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });

        });
    }

    if($('.portfolio-slider-wrap.interactive').length){
        $('.tabs-header > .container > ul > li > a').on('hover', function(e) {
            e.preventDefault();
            if (!$(this).parent().hasClass('active')) {
                var index_el = $(this).parent().index();

                $(this).parent().addClass('active').siblings().removeClass('active');
                $(this).parent().closest('.tabs').find('.tabs-item').removeClass('active').eq(index_el).addClass('active');
            } else {
                return false
            }
        });
    }

    if($('.portfolio-slider-wrap.split_slider').length) {
        var colors = $('.split-wrapper').data('colors');
        var colorsArray = colors.split(',');
        $('.split-wrapper').each(function () {
            $(this).multiscroll({
                sectionsColor: colorsArray,
                scrollingSpeed: 1300,
                easing: 'easeInOutQuart',
                useAnchorsOnLoad: false,
                sectionSelector: '.split-ms-section',
                leftSelector: '.split-ms-left',
                rightSelector: '.split-ms-right',
                scrollOverflow: false,
                normalScrollElements: '#topmenu, .right-menu'
           });
        });
    }

    // SWIPER OUTER WRAPPER BACKGROUND ON SWIPE
    function changeBg() {
        var colorBg = $('.swiper-container-vert-slider .swiper-slide-active').css("background-image");
        $('.outer-swiper-wrapper .img-overlay').css("background-image", colorBg);
    }
    
    function heightVerticalSlider() {
        var pageHeight = $(window).outerHeight();
        var footerHeight = $('#footer').outerHeight();
        if($('#wpadminbar').length){
            pageHeight = $(window).outerHeight() - 32;
            $('.header_top_bg.fixed-header').css('top', '32px');

        }
        if($('body').hasClass('static-menu')){
            var headerHeight = 71;
        }else{
            var headerHeight = $('.header_top_bg').outerHeight();
        }
        $('.swiper-container-vert-slider').css("height", pageHeight - (headerHeight + footerHeight));
        $('.outer-swiper-wrapper').css({"padding-top": headerHeight, "padding-bottom": footerHeight});
    }

    $(window).on('load resize', function () {
        changeBg();
        initSwiperVert();
        heightVerticalSlider();
    });

    // SWIPER 3 - HOME 9 - VERTICAL SLIDER SHORTCODE

    function initSwiperVert() {
        var pageHeight = $(window).outerHeight();
        var elVertSwiper = $('.swiper-container-vert-slider');
        if($('body').hasClass('static-menu')){
            var headerHeight = 71;
        }else{
            var headerHeight = $('.header_top_bg').outerHeight();
        }
        var footerHeight = $('#footer').outerHeight();

        if (elVertSwiper.length) {
            elVertSwiper.each(function () {
                var speed    = parseInt($(this).attr('data-speed'));
                var autoplay = parseInt($(this).attr('data-autoplay'));
                var loop     = parseInt($(this).attr('data-loop'));

                var vertSwiper = new Swiper($(this), {
                    direction: 'vertical',
                    speed: speed,
                    autoplay: autoplay,
                    loop: loop,
                    height: pageHeight - (headerHeight + footerHeight),
                    slidesPerView: 1,
                    mousewheelControl: true,
                    onSlideChangeEnd: function () {
                        changeBg();
                    },
                    nextButton: $(this).find('.swiper-button-next'),
                    prevButton: $(this).find('.swiper-button-prev')
                });
            })
        }
    }

    if($('.slider_classic').length){
        $('.slider_classic').each(function () {
            $(this).closest('.vc_row').css('z-index', '500');
        })
    }

})(jQuery, window, document);