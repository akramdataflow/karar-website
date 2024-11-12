;(function ($, window, document, undefined) {
    'use strict';

    $(window).on('load', function () {
        if ($('.spinner-preloader-wrap').length) {
            $('.spinner-preloader-wrap').fadeOut(500);
        }
        if ($('.preloader-text').length) {
            $('.preloader-text').fadeOut(500);
        }
        if ($('.image-preloader-wrap').length) {
            $('.image-preloader-wrap').fadeOut(500);
        }
	    if ($('.light-preloader-wrap').length) {
		    $('.light-preloader-wrap').fadeOut(500);
	    }
    });

    if ($('.fitVids').length) {
        $('body').fitVids({ignore: '.vimeo-video, .youtube-simple-wrap iframe, .iframe-video.for-btn iframe, .post-media.video-container iframe'});
    }

    /*=================================*/
    /* 01 - VARIABLES */
    /*=================================*/
    var swipers = [],
        winW, winH, winScr, _isresponsive, smPoint = 768,
        mdPoint = 992,
        lgPoint = 1200,
        addPoint = 1600,
        _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i),
        pageCalculateHeight;

    /*=================================*/
    /* 02 - PAGE CALCULATIONS */
    /*=================================*/
    /**
     *
     * PageCalculations function
     * @since 1.0.0
     * @version 1.0.1
     * @var winW
     * @var winH
     * @var winS
     * @var pageCalculations
     * @var onEvent
     **/
    if (typeof pageCalculations !== 'function') {

        var winW, winH, winS, pageCalculations, onEvent = window.addEventListener;

        pageCalculations = function (func) {

            winW = window.innerWidth;
            winH = window.innerHeight;
            winS = document.body.scrollTop;

            if (!func) return;

            onEvent('load', func, true); // window onload
            onEvent('resize', func, true); // window resize
            onEvent("orientationchange", func, false); // window orientationchange

        }// end pageCalculations

        pageCalculations(function () {
            pageCalculations();
        });
    }

    /*Full height banner*/
    function topBannerHeight() {
        var headerH = $('.header_top_bg').not('.header_trans-fixed, .fixed-header').outerHeight() || 0;
        var windowH = $(window).height();
        var offsetTop;
        var adminbarH;
        if ($('#wpadminbar').length) {
            offsetTop = headerH + $('#wpadminbar').outerHeight();
        } else {
            offsetTop = headerH;
        }

        if ($('#wpadminbar').length && $('.header_trans-fixed').length) {
            adminbarH = $('#wpadminbar').outerHeight();
        } else {
            adminbarH = 0;
        }


        $('.full-height-window').css('min-height', (windowH - offsetTop) + adminbarH + 'px');
        $('.full-height-window-hard').css('height', (windowH - offsetTop) + adminbarH + 'px');
        $('.middle-height-window-hard').css('height', (windowH - offsetTop) * 0.8 + adminbarH + 'px');

        $('body, .main-wrapper').css('min-height', $(window).height());
    }

    /* IF TOUCH DEVICE */
    function isTouchDevice() {
        return 'ontouchstart' in document.documentElement;
    }

    /*=================================*/
    /* SWIPER SLIDER */

    /*=================================*/
    function initSwiper() {
        var initIterator = 0;
        $('.swiper-container').each(function () {
            var $t = $(this);

            var index = 'swiper-unique-id-' + initIterator;
            $t.addClass('swiper-' + index + ' initialized').attr('id', index);
            $t.parent().find('.swiper-pagination').addClass('swiper-pagination-' + index);
            $t.parent().find('.swiper-button-next').addClass('swiper-button-next-' + index);
            $t.parent().find('.swiper-button-prev').addClass('swiper-button-prev-' + index);

            var setThumb = function (activeIndex, slidesNum) {
                var url_thumb,
                    leftClick = $t.find('.slider-click.left'),
                    rightClick = $t.find('.slider-click.right'),
                    slidesNum = slidesNum,
                    activeIndexLeft, activeIndexRight;
                if (loopVar === 1) {
                    if (activeIndex < 1) {
                        leftClick.removeClass('disabled').find('.left').text(slidesNum);
                        leftClick.find('.right').text(slidesNum);
                    }
                    else {
                        leftClick.removeClass('disabled').find('.left').text(activeIndex);
                        leftClick.find('.right').text(slidesNum);
                    }
                    if (activeIndex == slidesNum - 1) {
                        rightClick.removeClass('disabled').find('.left').text('1');
                        rightClick.find('.right').text(slidesNum);
                    }
                    else {
                        rightClick.removeClass('disabled').find('.left').text(activeIndex + 2);
                        rightClick.find('.right').text(slidesNum);
                    }
                } else {
                    if (activeIndex < 1) {
                        leftClick.addClass('disabled');
                    }
                    else {
                        leftClick.removeClass('disabled').find('.left').text(activeIndex);
                        leftClick.find('.right').text(slidesNum);
                    }
                    if (activeIndex == slidesNum - 1) {
                        rightClick.addClass('disabled');
                    }
                    else {
                        rightClick.removeClass('disabled').find('.left').text(activeIndex + 2);
                        rightClick.find('.right').text(slidesNum);
                    }
                }
            };

            if (isTouchDevice() && $t.data('mode') == 'vertical') {
                $t.attr('data-noswiping', 1);
                $(this).find('.swiper-slide').addClass('swiper-no-swiping');
            }

            var autoPlayVar = parseInt($t.attr('data-autoplay'), 10);
            var mode = $t.attr('data-mode');
            var effect = $t.attr('data-effect') ? $t.attr('data-effect') : 'slide';
            var paginationType = $t.attr('data-pagination-type');
            var loopVar = parseInt($t.attr('data-loop'), 10);
            var noSwipingVar = parseInt($t.attr('data-noSwiping'), 10);
            var mouse = parseInt($t.attr('data-mouse'), 10);
            var speedVar = parseInt($t.attr('data-speed'), 10);
            var centerVar = parseInt($t.attr('data-center'), 10);
            var spaceBetweenVar = parseInt($t.attr('data-space'), 10);
            var slidesPerView = parseInt($t.attr('data-slidesPerView'), 10) ? parseInt($t.attr('data-slidesPerView'), 10) : 'auto';
            var breakpoints = {};
            var responsive = $t.attr('data-responsive');
            if ($('.album_swiper').length && $(window).width() < 768) {
                loopVar = 1;
            } else {
                loopVar = parseInt($t.attr('data-loop'), 10);
            }
            if (responsive == 'responsive') {
                slidesPerView = $t.attr('data-add-slides');
                var lg = $t.attr('data-lg-slides') ? $t.attr('data-lg-slides') : $t.attr('data-add-slides');
                var md = $t.attr('data-md-slides') ? $t.attr('data-md-slides') : $t.attr('data-add-slides');
                var sm = $t.attr('data-sm-slides') ? $t.attr('data-sm-slides') : $t.attr('data-add-slides');
                var xs = $t.attr('data-xs-slides') ? $t.attr('data-xs-slides') : $t.attr('data-add-slides');

                breakpoints = {
                    768: {
                        slidesPerView: xs
                    },
                    992: {
                        slidesPerView: sm
                    },
                    1200: {
                        slidesPerView: md
                    },
                    1600: {
                        slidesPerView: lg
                    }
                };

            }

            var titles = [];
            $t.find('.swiper-slide').each(function () {
                titles.push($(this).data('title'));
            });

            if ($t.hasClass('swiper-album')) {
                breakpoints = {
                    480: {
                        slidesPerView: 1
                    },
                    767: {
                        slidesPerView: 3,
                        centeredSlides: false
                    },
                    991: {
                        slidesPerView: 4
                    },
                    1600: {
                        slidesPerView: 5
                    }
                };
            }

            swipers['swiper-' + index] = new Swiper('.swiper-' + index, {

                pagination: '.swiper-pagination-' + index,
                paginationType: paginationType,
                paginationBulletRender: function (swiper, index, className) {
                    if ($t.parent('.banner-slider-wrap.vertical_custom_elements').length || $t.parent('.banner-slider-wrap.vertical').length || $t.parent('.product-slider-wrapper').length) {
                        var title = titles[index];

                        if (index < 9) return '<span class="' + className + '"><i class="pagination-title">' + title + '</i><i>' + ('0' + (index + 1)) + '</i></span>';

                        return '<span class="' + className + '"><i class="pagination-title">' + title + '</i><i>' + (index + 1) + '</i></span>';
                    } else {
                        return '<span class="' + className + '"></span>';
                    }
                },
                direction: mode || 'horizontal',
                slidesPerView: slidesPerView,
                breakpoints: breakpoints,
                centeredSlides: centerVar,
                noSwiping: noSwipingVar,
                noSwipingClass: 'swiper-no-swiping',
                paginationClickable: true,
                spaceBetween: spaceBetweenVar,
                containerModifierClass: 'swiper-container-', // NEW
                slideClass: 'swiper-slide',
                slideActiveClass: 'swiper-slide-active',
                slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
                slideVisibleClass: 'swiper-slide-visible',
                slideDuplicateClass: 'swiper-slide-duplicate',
                slideNextClass: 'swiper-slide-next',
                slideDuplicateNextClass: 'swiper-slide-duplicate-next',
                slidePrevClass: 'swiper-slide-prev',
                slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
                wrapperClass: 'swiper-wrapper',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                buttonDisabledClass: 'swiper-button-disabled',
                paginationCurrentClass: 'swiper-pagination-current',
                paginationTotalClass: 'swiper-pagination-total',
                paginationHiddenClass: 'swiper-pagination-hidden',
                paginationProgressbarClass: 'swiper-pagination-progressbar',
                paginationClickableClass: 'swiper-pagination-clickable', // NEW
                paginationModifierClass: 'swiper-pagination-', // NEW
                lazyLoadingClass: 'swiper-lazy',
                lazyStatusLoadingClass: 'swiper-lazy-loading',
                lazyStatusLoadedClass: 'swiper-lazy-loaded',
                lazyPreloaderClass: 'swiper-lazy-preloader',
                notificationClass: 'swiper-notification',
                preloaderClass: 'preloader',
                zoomContainerClass: 'swiper-zoom-container',
                loop: loopVar,
                speed: speedVar,
                autoplay: autoPlayVar,
                effect: effect,
                mousewheelControl: mouse,
                nextButton: '.swiper-button-next-' + index,
                prevButton: '.swiper-button-prev-' + index,
                iOSEdgeSwipeDetection: true,
                onInit: function (swiper) {
                    if ($t.closest('.product-slider-wrapper') && $(window).width() < 1024) {
                        $t.find('.swiper-slide').addClass('swiper-no-swiping');
                    } else {
                        $t.find('.swiper-slide').removeClass('swiper-no-swiping');
                    }

                    if (winW > 1024 && $t.find(".slider-click").length) {
                        $t.find(".slider-click").each(function () {
                            var arrow = $(this);
                            $(document).on("mousemove", function (event) {
                                var arrow_parent = arrow.parent(),
                                    parent_offset = arrow_parent.offset(),
                                    pos_left = Math.min(event.pageX - parent_offset.left, arrow_parent.width()),
                                    pos_top = event.pageY - parent_offset.top;

                                arrow.css({
                                    'left': pos_left,
                                    'top': pos_top
                                });
                            });
                        });
                    }
                    var totalSlides = $('.swiper-slide:not(.swiper-slide-duplicate)').length;
                    if ($('.full_screen_slider').length) {
                        setThumb(swiper.realIndex, totalSlides);
                    }


                },
                onSlideChangeEnd: function (swiper) {
                    var totalSlides = $('.swiper-slide:not(.swiper-slide-duplicate)').length;
                    var activeIndex = (loopVar === 1) ? swiper.realIndex : swiper.activeIndex;
                    if ($('.full_screen_slider').length) {
                        setThumb(swiper.realIndex, totalSlides);
                    }
                },
                onSlideChangeStart: function (swiper) {
                    var totalSlides = $('.swiper-slide:not(.swiper-slide-duplicate)').length;
                    var activeIndex = (loopVar == 1) ? swiper.realIndex : swiper.activeIndex;
                    if ($('.full_screen_slider').length) {
                        setThumb(swiper.realIndex, totalSlides);
                    }
                    swiper.startAutoplay();
                }
            });
            initIterator++;
        });
    }


    $('.slider-click.left').on('click', function () {
        swipers['swiper-' + $(this).parent().parent().parent().find('.full_screen_slider').attr('id')].slidePrev();
        swipers['swiper-' + $(this).parent().parent().parent().find('.full_screen_slider').attr('id')].startAutoplay();
    });
    $('.slider-click.right').on('click', function () {
        swipers['swiper-' + $(this).parent().parent().parent().find('.full_screen_slider').attr('id')].slideNext();
        swipers['swiper-' + $(this).parent().parent().parent().find('.full_screen_slider').attr('id')].startAutoplay();
    });

    $(window).on('load resize', function() {
        // make square images for inline team
        if($('.about-mob-section-wrap').length){
            about_gallery_images();
        }

    });

    function about_gallery_images() {
        var imagesWidth = $('.about-mob-section-wrap .mobile-about-section .about-gallery-list li').innerWidth();
        $('.about-mob-section-wrap .mobile-about-section .about-gallery-list li').each( function() {
            $(this).innerHeight( imagesWidth );
        });
    }


    /*=================================*/
    /* MAIN WRAPPER */

    /*=================================*/

    function calcPaddingMainWrapper() {
        var footer = $('#footer');
        var paddValue = footer.outerHeight();
        footer.bind('heightChange', function () {
            if (!$("#footer.fix-bottom").length && $("#footer.footer-parallax").length) {
                $('.main-wrapper').css('margin-bottom', paddValue);
            } else if (!$("#footer.fix-bottom").length) {
                $('.main-wrapper').css('padding-bottom', paddValue);
            }
        });

        footer.trigger('heightChange');
    }

    if ($(".animsition").length) {
        $(".animsition").animsition({
            inClass: 'fade-in',
            outClass: 'fade-out',
            inDuration: 2000,
            outDuration: 800,
            loading: true,
            loadingParentElement: 'body', //animsition wrapper element
            loadingClass: 'animsition-loading',
            unSupportCss: ['animation-duration',
                '-webkit-animation-duration',
                '-o-animation-duration'
            ],
            overlay: false,
            overlayClass: 'animsition-overlay-slide',
            overlayParentElement: 'body'
        });
    }

    /*=================================*/
    /* FOOTER WIDGETS HEIGHT */

    /*=================================*/

    function footerWidgetsHeight() {
        if ($('#footer .sidebar-item').length) {
            $('#footer .widg').each(function () {
                var layoutM = 'masonry';
                $(this).isotope({
                    itemSelector: '.sidebar-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.sidebar-item'
                    }
                });
            });
        }
    }

    /*=================================*/
    /* PORTFOLIO ITEM */

    /*=================================*/

    function portfolioAlbum() {
        if ($('.portfolio .block_item_0').length) {
            $('.portfolio .wpb_wrapper').each(function () {
                var layoutM = 'masonry';
                $(this).isotope({
                    itemSelector: '.block_item_0',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.block_item_0'
                    }
                });
            });
        }
    }

    /*=================================*/
    /* ADD IMAGE ON BACKGROUND */

    /*=================================*/

    function wpc_add_img_bg(img_sel, parent_sel) {
        if (!img_sel) {

            return false;
        }
        var $parent, $imgDataHidden, _this;
        $(img_sel).each(function () {
            _this = $(this);
            $imgDataHidden = _this.data('s-hidden');
            $parent = _this.closest(parent_sel);
            $parent = $parent.length ? $parent : _this.parent();
            $parent.css('background-image', 'url(' + this.src + ')').addClass('s-back-switch');
            if ($imgDataHidden) {
                _this.css('visibility', 'hidden');
                _this.show();
            }
            else {
                _this.hide();
            }
        });
    }

    // Canvas wrap
    function canvasWrap() {
        $('canvas:not(.scene--full)').wrap('<div class="canvas-wrap"></div>');
    }

    // SEARCH POPUP
    $('.open-search').on('click', function () {
        $('body').css('overflow', 'hidden');
        $('.site-search').addClass('open');
    });
    $('.close-search').on('click', function () {
        $('body').css('overflow', '');
        $('.site-search').removeClass('open');
    });

    /*=================================*/
    /* ASIDE MENU */

    /*=================================*/
    function toggleAsideMenu() {
        // ASIDE MENU NAVIGATION
        $('.aside-nav').on('click', function () {
            $('.aside-menu').toggleClass('active-menu');
            $('.topmenu').toggleClass('active-menu');
            return false;
        });
        // TOGGLE ASIDE SUBMENU
        var dataTop = $('.main-wrapper').data('top');
        if ($(window).width() > 991 && !$('body').hasClass('mob-main-menu') || $(window).width() > 1024 && $('body').hasClass('mob-main-menu')) {

            $('.main-wrapper').on('click', function (e) {
                if (!e.target.closest('.aside-menu')) {
                    $('.sub-menu-open').slideUp(400);
                }
            });

            $('.aside-menu .menu-item-has-children a').addClass('hide-drop');

            $('.aside-menu .menu-item a').on('click', function () {
                if ($(this).parent().hasClass('menu-item-has-children')) {
                    if ($(this).hasClass('hide-drop')) {
                        if ($(this).closest('.sub-menu').length) {
                            $(this).removeClass('hide-drop').next('.sub-menu').slideDown(400).removeClass('sub-menu-open');
                            $(this).parent().siblings().find('.sub-menu').slideUp(400).addClass('sub-menu-open');
                        } else {
                            $('.menu-item-has-children a').addClass('hide-drop').next('.sub-menu').hide(100).removeClass('sub-menu-open');
                            $(this).removeClass('hide-drop').next('.sub-menu').slideToggle(400).toggleClass('sub-menu-open');
                        }
                    } else {
                        $(this).addClass('hide-drop').next('.sub-menu').hide(100).find('.menu-item-has-children a').addClass('hide-drop').next('.sub-menu').hide(100);
                        $(this).next('.sub-menu').removeClass('sub-menu-open');
                    }
                }
            });


        } else {
            $('.menu-item-has-children a').removeClass('hide-drop');
        }
        if ($('.aside-fix').length && $(window).width() > dataTop) {
            var logoWidth = $('.logo span, .logo img').outerWidth();
            $('.logo').css('top', logoWidth + 'px');
        }
    }

    /*=================================*/
    /* MOBILE MENU */
    /*=================================*/
    $('.mob-nav').on('click', function (e) {
        e.preventDefault();
        $('html').addClass('no-scroll sidebar-open').height(window.innerHeight + 'px');
        if ($('#wpadminbar').length) {
            $('.sidebar-open #topmenu').css('top', '46px');
        } else {
            $('.sidebar-open #topmenu').css('top', '0');
        }
    });
    $('.mob-nav-close').on('click', function (e) {
        e.preventDefault();
        $('html').removeClass('no-scroll sidebar-open').height('auto');
    });


    function fixedMobileMenu() {
        var headerHeight = $('.header_top_bg').not('.header_trans-fixed').outerHeight();
        var offsetTop;
        var dataTop = 1025;
        var adminbarHeight = $('#wpadminbar').outerHeight();
        if ($('#wpadminbar').length) {
            offsetTop = adminbarHeight + headerHeight;
            $('.header_top_bg').css('margin-top', adminbarHeight);
        } else {
            offsetTop = headerHeight;
        }
        if ($(window).width() < dataTop) {
            $('.main-wrapper').css('padding-top', offsetTop + 'px');
        } else {
            $('.main-wrapper').css('padding-top', '0');
        }
        if ($('#wpadminbar').length && $(window).width() < 768) {
            $('#wpadminbar').css({
                'position': 'fixed',
                'top': '0'
            })
        }
    }

    function menuArrows() {
        var mobW = 1025;
        if (($(window).width() < mobW)) {
            if (!$('.menu-item-has-children i').length) {
                $('header .menu-item-has-children').append('<i class="ion-ios-arrow-down"></i>');
                $('header .menu-item-has-children i').addClass('hide-drop');
            }

            $('header .menu-item i').on('click', function () {
                if ($(this).parent().hasClass('menu-item-has-children') && !$(this).hasClass('animation')) {
                    $(this).addClass('animation');
                    if ($(this).hasClass('hide-drop')) {
                        if ($(this).closest('.sub-menu').length) {
                            $(this).removeClass('hide-drop').prev('.sub-menu').slideToggle(400);
                        } else {
                            $('.menu-item-has-children i').addClass('hide-drop').next('.sub-menu').hide(100);
                            $(this).removeClass('hide-drop').prev('.sub-menu').slideToggle(400);
                        }
                    } else {
                        $(this).addClass('hide-drop').prev('.sub-menu').hide(100).find('.menu-item-has-children a').addClass('hide-drop').prev('.sub-menu').hide(100);
                    }
                }
                setTimeout(removeClass, 400);

                function removeClass() {
                    $('header .menu-item i').removeClass('animation');
                }
            });
        } else {
            $('header .menu-item-has-children i').remove();
        }
    }

    /*=================================*/
    /* ANIMATION */
    /*=================================*/

    $.fn.isInViewport = function (offsetB) {

        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height() - offsetB;

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    function addAnimation() {

        if ($('.headings-wrap').length && $('.headings-wrap').hasClass('load-fade')) {
            var headings =  $('.headings-wrap.load-fade').find('.headings');
            headings.each(function () {
                var animationClass = 'animation';
                var elements = $(this).children();
                var headingOffsetB;
                if ($(window).width() > 1024) {
                    headingOffsetB = 50;
                } else {
                    headingOffsetB = 0;
                }
                if (elements.isInViewport(headingOffsetB)) {
                    elements.addClass(animationClass);
                } else {
                    elements.removeClass(animationClass);
                }
            });
        }
        if ($('.portfolio-grid').length || $('.portfolio-masonry').length) {
            $('.portfolio-grid, .portfolio-masonry').each(function () {
                if ($(window).scrollTop() >= $(this).offset().top - $(window).height() * .8) {
                    $(this).addClass('animation');
                }
            });
        }
    }

    function addTransition() {
        if ($('.headings-wrap').length && $('.headings-wrap').hasClass('load-fade')) {
            var headings =  $('.headings-wrap.load-fade').find('.headings');
            headings.each(function () {
                var elements = $(this).children();
                for (var i = 0; i < $(this).children().length; i++) {
                    elements.eq(i).addClass('fade-up transition-' + i);
                }
            });
        }
    }

    /*=================================*/
    /* HEADER SCROLL */
    /*=================================*/

    $(window).on('scroll', function () {
        if ($(this).scrollTop() >= 150) {
            if ($('.header_top_bg.header_trans-fixed').length) {
                $('.header_top_bg.header_trans-fixed').not('.fixed-dark').addClass('bg-fixed-color');
                $('.fixed-dark').addClass('bg-fixed-dark');
                $('.logo-hover').show();
                $('.main-logo').hide();
            }
        } else {
            if ($('.header_top_bg.header_trans-fixed').length) {
                $('.header_top_bg.header_trans-fixed').not('.fixed-dark').removeClass('bg-fixed-color');
                $('.fixed-dark').removeClass('bg-fixed-dark');
                $('.logo-hover').hide();
                $('.main-logo').show();
            }
        }
    });

    /*=================================*/
    /* ABOUT SECTION */
    /*=================================*/

    $('.about-hamburger').on('click', function () {
        $('.about-mob-section-wrap').toggleClass('open');
        $(window).resize();
    });

    /*=================================*/
    /* BLOG */
    /*=================================*/

    /* MAGNIFIC POPUP VIDEO */
    function popupVideo() {
        if ($('.blog .video-content-blog').length || $('.single-post .video-content-blog').length) {
            $('.play').each(function () {
                $(this).magnificPopup({
                    disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: true,
                    fixedBgPos: true
                });
            });
        }
    }

    // image slider
    // ---------------------------------
    if ($('.img-slider').length) {
        $('.img-slider .slides').each(function () {
            $(this).slick({
                fade: true,
                autoplay: true,
                speed: 500,
                dots: false,
                prevArrow: "<div class='flex-prev'><i class='ion-ios-arrow-thin-left'></i></div>",
                nextArrow: "<div class='flex-next'><i class='ion-ios-arrow-thin-right'></i></div>"
            });
        })
    }

    // Equal height for blog
    function equalHeight() {
        if ($('.metro').length && $(window).width() > 767) {
            $('.metro .post-wrap-item').css('height', 'auto').equalHeights();
        } else if ($('.metro').length) {
            $('.metro .post-wrap-item').css('height', 'auto');
        }

        if ($('.post-slider-wrapper.slider_progress').length) {
            $('.post-slider-wrapper.slider_progress .content-wrap').css('height', 'auto').equalHeights();
        }
    }

    // Load more for blog
    function load_more_blog_posts() {
        // Load More Portfolio
        if (window.load_more_blog_posts) {

            var pageNum = parseInt(window.load_more_blog_posts.startPage);

            // The maximum number of pages the current query can return.
            var max = parseInt(window.load_more_blog_posts.maxPage);

            // The link of the next page of posts.
            var nextLink = window.load_more_blog_posts.nextLink;

            // wrapper selector
            var wrap_selector = '.blog.metro';

            //button click
            $('.js-load-more').on('click', function (e) {

                var $btn = $(this),
                    $btnText = $btn.html();
                $btn.html('loading...');

                if (pageNum <= max) {

                    var $container = $(wrap_selector);
                    $.ajax({
                        url: nextLink,
                        type: "get",
                        success: function (data) {
                            var newElements = $(data).find('.blog.metro .post');
                            var elems = [];

                            newElements.each(function (i) {
                                elems.push(this);
                            });

                            $container.append(elems);
                            $container.find('img[data-lazy-src]').foxlazy();

                            wpc_add_img_bg('.s-img-switch');
                            if ($(window).width() > 767) {
                                $('.metro .post-wrap-item').css('height', 'auto').equalHeights();
                            } else {
                                $('.metro .post-wrap-item').css('height', 'auto');
                            }

                            $('img[data-lazy-src]').foxlazy();
                            pageNum++;
                            nextLink = nextLink.replace(/\/page\/[0-9]?/, '/page/' + pageNum);

                            $btn.html($btnText);

                            if (pageNum == ( max + 1 )) {
                                $btn.hide('fast');
                            }
                        }
                    });
                }
                return false;
            });
        }
    }

// Likes for blog
    function toggleLikeFromCookies($element, postId) {
        if (document.cookie.search(postId) === -1) {
            $element.removeClass('post__likes--liked');
        } else {
            $element.addClass('post__likes--liked');
        }
    }

    var $likes = $('.post__likes');

    for (var i = 0; i < $likes.length; i++) {
        toggleLikeFromCookies($likes.eq(i), $likes.eq(i).attr('data-id'));
    }

    $likes.on('click', function (e) {
        var $this = $(this),
            post_id = $this.attr('data-id');
        $this.toggleClass('post__likes--liked');
        $this.addClass('post__likes--disable');

        $.ajax({
            type: "POST",
            url: get.ajaxurl,
            data: ({
                action: 'wiso_like_post',
                post_id: post_id
            }),
            success: function (msg) {
                $this.closest('.likes-wrap').find('.count').text(msg);
                toggleLikeFromCookies($this, post_id);
                $this.removeClass('post__likes--disable');
            }
        });
        return false;
    });

    // isotope
    function initBlogIsotope() {
        if ($('.izotope-blog').length) {
            var self = $('.izotope-blog');
            var layoutM = 'masonry';
            self.isotope({
                itemSelector: '.post',
                layoutMode: layoutM,
                masonry: {
                    columnWidth: '.post'
                }
            });

        }
    }

    // back to top
    $('#back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });

    /*=================================*/
    /* PORTFOLIO DETAIL */
    /*=================================*/

    if ($('.light-gallery').length) {

        $('.light-gallery').each(function () {
            var thumb = (typeof $(this).attr('data-thumb') !== undefined) && (typeof $(this).attr('data-thumb') !== false) ? $(this).attr('data-thumb') : true;
            thumb = thumb === 'false' ? false : true;

            var selector = $(this).closest('.metro_3, .metro_4').length ? '.gallery-item-wrap' : '.gallery-item:not(.popup-details)';

            $(this).lightGallery({
                selector: selector,
                mode: 'lg-slide',
                closable: true,
                iframeMaxWidth: '80%',
                download: false,
                thumbnail: true,
                showThumbByDefault: thumb
            });
        });
    }

    function initIsotope() {
        if ($('.izotope-container').length) {
            $('.izotope-container').each(function () {
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.gallery-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.gallery-item, .grid-sizer',
                        gutterWidth: 30
                    }
                });
            });
        }

        if ($('.grid-main').length) {
            $('.grid-main').each(function () {
                var gutter = $(window).width() < 1199 ? 30 : 50;
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.grid-main-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.grid-main-item',
                        gutter: gutter
                    }
                });
            });
        }

        if ($('.grid-main-masonry').length) {
            $('.grid-main-masonry').each(function () {
                var gutter = $(window).width() < 1199 ? 50 : 80;
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.grid-main-masonry-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.grid-main-masonry-item',
                        gutter: gutter
                    }
                });
            });
        }

        if ($('.simple-grid').length) {
            $('.simple-grid').each(function () {
                var gutter = $(window).width() < 1199 ? 30 : 50;
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.simple-grid-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.simple-grid-item',
                        gutter: gutter
                    }
                });
            });
        }

        if ($('.classik-grid-2').length) {
            $('.classik-grid-2').each(function () {
                var gutter = $(window).width() < 1199 ? 25 : 30;
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.classik-grid-2-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.classik-grid-2-item',
                        gutter: gutter
                    }
                });
            });
        }
        if ($('.pages-grid').length) {
            $('.pages-grid').each(function () {
                var gutter = $(window).width() < 1199 ? 30 : 30;
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.pages-grid-item',
                    layoutMode: layoutM,
                    percentPosition: true,
                    masonry: {
                        columnWidth: '.pages-grid-item',
                        gutter: gutter
                    }
                });
            });
        }
        if ($('.big-creative-grid').length) {
            $('.big-creative-grid').each(function () {
                var gutter = $(window).width() < 1199 ? 30 : 50;
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.big-creative-grid-item',
                    layoutMode: layoutM,
                    percentPosition: true,
                    masonry: {
                        columnWidth: '.big-creative-grid-item',
                        gutter: gutter
                    }
                });
            });
        }
        if ($('.creative-grid-2').length) {
            $('.creative-grid-2').each(function () {
                var gutter = $(window).width() < 1199 ? 30 : 30;
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.creative-grid-2-item',
                    layoutMode: layoutM,
                    percentPosition: true,
                    masonry: {
                        columnWidth: '.creative-grid-2-item',
                        gutter: gutter
                    }
                });
            });
        }
        if ($('.events-wrapper').length) {
            $('.events-wrapper').each(function () {
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.event-post-box',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.event-post-box',
                        gutterWidth: 30
                    }
                });
            });
        }

        if ($('.masonry .light-gallery').length) {
            $('.masonry .light-gallery').each(function () {
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.gallery-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.gallery-item',
                        'gutter': 30
                    }
                });
            });
        }

        if ($('.grid .light-gallery').length) {
            $('.grid .light-gallery').each(function () {
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.gallery-item-wrap',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.gallery-item-wrap',
                        'gutter': 30
                    }
                });
            });
        }

        if ($('.metro_2 .light-gallery, .metro_4 .light-gallery').length) {
            var gutter = $(window).width() < 1199 ? 12 : 30;
            $('.metro_2 .light-gallery, .metro_4 .light-gallery').each(function () {
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.gallery-item-wrap',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.gallery-item-wrap',
                        'gutter': gutter
                    }
                });
            });
        }
    }
  function initIsotopeMetro3() {
    if ($('.metro_3 .light-gallery').length) {
      $('.metro_3 .light-gallery').each(function () {
        var self = $(this);
        var layoutM = self.attr('data-layout') || 'masonry';
        self.isotope({
          itemSelector: '.gallery-item-wrap',
          layoutMode: layoutM,
          masonry: {
            columnWidth: '.gallery-item-wrap',
            'gutter': 9
          }
        });
      });
    };
  }

    function leftGalleryImages() {
        if ($('.portfolio-single-content.left_gallery .gallery-item').length) {
            $("img[data-lazy-src]").foxlazy();
            $('.portfolio-single-content.left_gallery .gallery-item').each(function () {
                var height = $(this).height();
                var width = $(this).width();
                if (height > width) {
                    $(this).addClass('vertical');
                } else {
                    $(this).addClass('horizontal');
                }
            });
        }
    }

    pageCalculations(function () {
        if (!window.enable_foxlazy) {
            wpc_add_img_bg('.s-img-switch');
        }

        /* fix for splited slider */
        wpc_add_img_bg('.ms-section .s-img-switch');
        wpc_add_img_bg('.woocommerce .s-img-switch');
    });

    function popup_image() {
        if ($('.popup-image').length) {
            $('.popup-image').each(function () {
                $(this).lightGallery({
                    selector: 'this',
                    mode: 'lg-slide',
                    closable: true,
                    iframeMaxWidth: '80%',
                    download: false,
                    thumbnail: true
                });
            });
        }
    }

    popup_image();


    $('.product button[type="submit"]').on('click', function () {
        $("img[data-lazy-src]").foxlazy();
    });

    /*product slider*/
    if ($('.wiso_images').length) {
        $('.product-gallery-wrap').each(function () {
            $(this).slick({
                dots: false,
                arrows: false,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                asNavFor: '.product-gallery-thumbnail-wrap',
                fade: true,
                draggable: false
            })
        });
        $('.product-gallery-thumbnail-wrap').each(function () {
            $(this).slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: false,
                arrows: false,
                asNavFor: '.product-gallery-wrap',
                vertical: false,
                focusOnSelect: true,
                responsive: [
                    {
                        breakpoint: 770,
                        settings: {
                            slidesToShow: 3,
                            vertical: false
                        }
                    }
                ]
            })
        })
    }

    /* ------------------------------------------- */
    /* EVENT ASIDE FIXED */

    /* ------------------------------------------- */

    function asideFixed() {

        $('.js-fixed-aside').each(function (index, el) {
            if ($(this).outerWidth() < 0.75 * $(window).outerWidth()) {

                // add animation
                $(this).css('transition', 'transform 500ms');
                var parent = $(this).closest('.js-fixed-parent');

                var parentHeight = parent.outerHeight();
                var itemHeight = $(this).outerHeight();
                var headerHeight = $('.header_trans-fixed').outerHeight() || 0;

                var parentOffset = parent.offset().top;
                var scrollPosition = $(window).scrollTop();
                var positionAsideTop = scrollPosition - (parentOffset - headerHeight) + 30;
                var positionAsideBottom = positionAsideTop - (parentHeight - itemHeight);

                if (positionAsideTop > 0 && (positionAsideBottom < 0)) {
                    $(this).css('transform', 'translateY(' + positionAsideTop + 'px)');
                } else if (positionAsideBottom > 0) {
                    $(this).css('transform', 'translateY(' + (parentHeight - itemHeight) + 'px)');
                } else {
                    $(this).css('transform', 'translateY(0px)');
                }
            } else {
                $(this).css('transform', 'translateY(0px)');
            }
        });
    }

    /**********************************/
    /* VIDEO CONTROLS */

    /**********************************/

    function onYouTubeIframeAPIReady() {
        if (_ismobile) {
            $('.iframe-video').removeClass('play').find('.play-button').removeClass('start');
        }

        var player = [],
            $iframe_parent = [],
            $this;

        // each all iframe
        $('.iframe-video.youtube iframe').each(function (i) {
            // get parent element
            $this = $(this);
            $iframe_parent[i] = $this.closest('.iframe-video.youtube');
            // init video player

            player[i] = new YT.Player(this, {
                // callbacks
                events: {
                    'onReady': function (event) {
                    },
                    'onStateChange': function (event) {
                        switch (event.data) {
                            case 1:
                                // start play
                                if (($iframe_parent[i].data('mute')) && ($iframe_parent[i].find('.mute-button').hasClass('mute1'))) {
                                    player[i].mute();
                                } else {
                                    player[i].unMute();
                                }
                                break;
                            case 2:
                                // pause
                                $iframe_parent[i].removeClass('play').find('.play-button').removeClass('start');
                                break;
                            case 3:
                                // buffering
                                break;
                            case 0:
                                // end video
                                $iframe_parent[i].removeClass('play').find('.play-button').removeClass('start');
                                break;
                            default:
                                '-1'
                            // not play
                        }
                    }
                }
            });

            var muteButton = $iframe_parent[i].find('.mute-button');
            // mute video
            if (muteButton.length) {
                muteButton.on('click', function () {
                    if (muteButton.hasClass('mute1')) {
                        player[i].unMute();
                        muteButton.removeClass('mute1');
                    } else {
                        player[i].mute();
                        muteButton.addClass('mute1');
                    }
                });
            }

            // click play/pause video
            $iframe_parent[i].find('.play-button').on('click', function (event) {
                event.preventDefault();
                var $parent = $iframe_parent[i];
                if ($parent.hasClass('play')) {
                    player[i].pauseVideo();
                    $parent.removeClass('play').find('.play-button').removeClass('start');
                } else {
                    player[i].playVideo();
                    $parent.addClass('play').find('.play-button').addClass('start');
                }
            });

            // stop video
            $iframe_parent[i].find('.video-close-button').on('click', function () {
                player[i].stopVideo();
                $iframe_parent[i].removeClass('play').find('.play-button').removeClass('start');
            });
        });
    };

    var gridWrapper = $('.tg-grid-wrapper');
    if (gridWrapper.length) {
        window.addEventListener('load', function () {
            window.dispatchEvent(new Event('resize'));
        });
    }

    /* ------------------------------------------- */
    /* URBAN SLIDER */

    /* ------------------------------------------- */
    function initUrbanSlider() {
        var winWidth = window.innerWidth,
            slideWidth;
        if (winWidth > 768) {
            slideWidth = winWidth * 0.65;
        } else {
            slideWidth = winWidth;
        }
        if ($('.portfolio-single-content.urban_slider').length) {
            $('.gallery-top-slide').width(slideWidth);
        }

        if ($('.portfolio-single-content.urban_slider').length) {

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
    }

    /* Copyright */
    if ($('.wiso_copyright_overlay').length) {
        $(document).on('contextmenu',function(event){
            if($('.wiso_copyright_overlay').hasClass('copy')){
                event.preventDefault();
            }else if(event.target.tagName != 'A'){
                event.preventDefault();
            }
            $('.wiso_copyright_overlay').addClass('active');
        }).on('click', function(){
            $('.wiso_copyright_overlay').removeClass('active').removeAttr('style');
        });
    }


    $(window).on('load', function () {
        wpc_add_img_bg('.s-img-switch');
        canvasWrap();
        toggleAsideMenu();
        addTransition();
        if (typeof foxlazy  === 'function') {
            $("img[data-lazy-src]").foxlazy();
        }
        // fix
        setTimeout(function () {
            $(window).scroll();
        }, 300);
        setTimeout(function () {
          initIsotope();
        }, 500);
        popupVideo();
        load_more_blog_posts();
        onYouTubeIframeAPIReady();
        initIsotopeMetro3();
    });
    $(window).on('load scroll resize', function () {
        if ($("img[data-lazy-src]").length) {
            $("img[data-lazy-src]").foxlazy('', function () {
                initIsotope();
            });
        }
    });
    $(window).on('scroll resize', function () {
        addAnimation();
    });
    $(window).on('scroll', function () {
        asideFixed();
    });
    $(window).on('load resize', function () {
        initIsotope();
        setTimeout(function () {
          initIsotopeMetro3();
        }, 300);
    });
    $(window).on('load resize', function () {
        setTimeout(initSwiper, 100);
        footerWidgetsHeight();
        calcPaddingMainWrapper();
        topBannerHeight();
        fixedMobileMenu();
        menuArrows();
        initBlogIsotope();
        asideFixed();
        if (typeof foxlazy  === 'function') {
            $("img[data-lazy-src]").foxlazy('', function () {
                setTimeout(initBlogIsotope, 500);
            });
        }
        setTimeout(equalHeight, 1);
        portfolioAlbum();
        leftGalleryImages();
        initUrbanSlider();
    });
    window.addEventListener("orientationchange", function () {
        initSwiper();
        footerWidgetsHeight();
        calcPaddingMainWrapper();
        topBannerHeight();
        fixedMobileMenu();
        menuArrows();
        equalHeight();
        portfolioAlbum();
        initIsotope();
        initUrbanSlider();
    });

    $(window).bind("load", function() {
        if ($('.lima_grid_items').length) {
            $('.lima_grid_items').addClass('lima-grid_animation');
        }
        if ($('.grid-transform-items').length) {
            $('.grid-transform-items').addClass('grid-transform_animation');
        }
        if ($('.fullscreen-album-items').length) {
            $('.fullscreen-album-items').addClass('fullscreen-album_animation');
        }
        if ($('.praia-portfolio-items').length) {
            $('.praia-portfolio-items').addClass('praia-portfolio_animation');
        }
        if ($('.portfolio-metro-items').length) {
            var portfolio_isotope = $('.portfolio-metro-items').isotope({
                itemSelector: '.portfolio-metro-item',
            });
            $('.all').on('click', function () {
                $('.tg-filter span').removeClass('tg-filter-active');
                $(this).addClass('tg-filter-active ');
                portfolio_isotope.isotope({
                    filter: '*'
                });
            });
            $('.ideas').on('click',function () {
                $('.tg-filter span').removeClass('tg-filter-active');
                $(this).addClass('tg-filter-active ');
                portfolio_isotope.isotope({
                    filter: '.f32'
                });
            });
            $('.impressure').on('click',function () {
                $('.tg-filter span').removeClass('tg-filter-active');
                $(this).addClass('tg-filter-active ');
                portfolio_isotope.isotope({
                    filter: '.f26'
                });
            });
            $('.tiramila').on('click',function () {
                $('.tg-filter span').removeClass('tg-filter-active');
                $(this).addClass('tg-filter-active ');
                portfolio_isotope.isotope({
                    filter: '.f34'
                });
            });
        }
    });



    $(window).on('load', function(){
        if ($('.pinterest-portfolio-items').length) {
            var $container = $('.pinterest-portfolio-items');
            // initialize
            $container.masonry({
                itemSelector: '.pinterest-portfolio-item'
            });
            $('.pinterest-portfolio-items').addClass('pinterest-portfolio_animation');
        }
    });

    if ($('.dgwt-jg-gallery').length) {
        $(window).on('load', function () {
            $('.dgwt-jg-gallery').each(function () {
                var $gallery = $(this), $item = $gallery.find('.dgwt-jg-item');
                if ($gallery.length > 0 && $item.length > 0) {
                    $gallery.lightGallery({thumbnail: !0, download: !1, closable: !1});
                    $item.children('img').each(function () {
                        if (typeof $(this).attr('srcset') !== 'undefined') {
                            $(this).attr('data-jg-srcset', $(this).attr('srcset'));
                            $(this).removeAttr('srcset')
                        }
                    });
                    $gallery.justifiedGallery({
                        lastRow: 'nojustify',
                        captions: !1,
                        margins: 3,
                        rowHeight: $gallery.data('height'),
                        maxRowHeight: -1,
                        thumbnailPath: function (currentPath, width, height, $image) {
                            if (typeof $image.data('jg-srcset') === 'undefined') {
                                return currentPath
                            }
                            var srcset = $image.data('jg-srcset');
                            if ($image.length > 0 && srcset.length > 0) {
                                var path, sizes = [], sizesTemp = [], urls = srcset.split(",");
                                if (urls.length > 0) {
                                    for (i = 0; i < urls.length; i++) {
                                        var url, sizeW, item = urls[i].trim().split(" ");
                                        if (typeof item[0] != 'undefined' && typeof item[1] != 'undefined') {
                                            var sizeW = item[1].replace('w', '');
                                            sizesTemp[sizeW] = {width: item[1].replace('w', ''), url: item[0]}
                                        }
                                    }
                                    for (i = 0; i < sizesTemp.length; i++) {
                                        if (sizesTemp[i]) {
                                            sizes.push(sizesTemp[i])
                                        }
                                    }
                                }
                                for (i = 0; i < sizes.length; i++) {
                                    if (sizes[i].width >= width) {
                                        return sizes[i].url
                                    }
                                }
                                return currentPath
                            } else {
                                return currentPath
                            }
                        }
                    }).on('jg.complete', function (e) {
                        $item.each(function () {
                            $(this).on('mouseenter mouseleave', function (e) {
                                var $this = $(this), width = $this.width(), height = $this.height();
                                var x = (e.pageX - $this.offset().left - (width / 2)) * (width > height ? (height / width) : 1),
                                    y = (e.pageY - $this.offset().top - (height / 2)) * (height > width ? (width / height) : 1);
                                var dir_num = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4,
                                    directions = ['top', 'right', 'bottom', 'left'];
                                if (e.type === 'mouseenter') {
                                    $this.removeClass(function (index, css) {
                                        return (css.match(/(^|\s)hover-out-\S+/g) || []).join(' ')
                                    });
                                    $this.addClass('hover-in-' + directions[dir_num])
                                }
                                if (e.type === 'mouseleave') {
                                    $this.removeClass(function (index, css) {
                                        return (css.match(/(^|\s)hover-in-\S+/g) || []).join(' ')
                                    });
                                    $this.addClass('hover-out-' + directions[dir_num])
                                }
                            })
                        })
                    })
                }
            })
        })
    }

    if ($('.metro').length) {
        $('.metro-load-more__button').on("click", function () {
            var thisLink = $(this);
            thisLink.html('loading...');
            function customDelay() {
                $('.metro').find('.post').removeClass('post_hide');
                $('.metro-load-more__button').addClass('post_hide');
            }

            setTimeout(customDelay, 1000);
        });
    }
    $('.mob-nav').on('click',function () {
        $('.about-mob-section-wrap').removeClass('open');
    });
    $('.about-mob-section-wrap').on('click', function () {
        $('body').toggleClass('overflow-full');
    });


    if ($('.home-blog').length) {
        var home_blog = $('.home-blog').isotope({
            itemSelector: '.tg-item',
        });
    }
})(jQuery, window, document);