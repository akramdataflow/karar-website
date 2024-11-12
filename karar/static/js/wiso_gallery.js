;(function ($, window, document, undefined) {
    'use strict';

    function initThumbFlexSlider() {
        $('.main-thumb-slider').flexslider({
            animation: "fade",
            animationSpeed: 600,
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            sync: ".sub-thumb-slider"
        });

        $('.sub-thumb-slider').flexslider({
            animation: "slide",
            animationSpeed: 600,
            controlNav: true,
            animationLoop: true,
            direction: "horizontal",
            slideshow: false,
            itemWidth: 100,
            itemMargin: 5,
            mousewheel: true,
            asNavFor: '.main-thumb-slider'
        });
    }

    function glitchThumb() {
      var elVertSwiper = $('.swiper-container-vert-slider');
      if (elVertSwiper.length) {
        elVertSwiper.each(function () {
          var vertSwiper = new Swiper($(this), {
            direction: 'vertical',
            autoplay: false,
            loop: false,
            spaceBetween: 0,
            slidesPerView: 'auto',
            mousewheelControl: true,
            nextButton: $(this).next('.swiper-button-next'),
            prevButton: $(this).prev('.swiper-button-prev')
          });
        })
      }
    }

    function initIsotope() {
      if ($('.gallery-masonry').length) {
        $('.gallery-masonry').each(function () {
          var self = $(this);
          var layoutM = self.attr('data-layout') || 'masonry';
          self.isotope({
            itemSelector: '.item',
            layoutMode: layoutM,
            masonry: {
              columnWidth: '.item',
              gutterWidth: 30
            }
          });
        });
      }
    }

    $('.gallery-masonry').lightGallery({
        selector: '.item',
        mode: 'lg-slide',
        closable: true,
        iframeMaxWidth: '80%',
        download: false,
        thumbnail: true
    });

    $('.thumb-slider-wrapp-arrow').on('click', function () {
        $(this).toggleClass('active').parent().find('.sub-thumb-slider').toggleClass('active');
    });

    $(window).on('load', function () {
        initIsotope();
    });

    $(window).on('resize', function () {
        initIsotope();
    });


    $(window).on('load resize', function () {

        if ($('.with_thumbnile .thumb-slider-wrapp').length) {
            initThumbFlexSlider();
        }

        if ($('.glitch .swiper-container-vert-slider').length) {
          glitchThumb();
        }
    });

  window.addEventListener("orientationchange", function() {
      initIsotope();
  });

})(jQuery, window, document);