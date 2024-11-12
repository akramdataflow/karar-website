;(function ($, window, document, undefined) {
    'use strict';
    if($('.insta-wrapper').length) {
        $('.insta-wrapper').lightGallery({
            selector: '.insta-item',
            mode: 'lg-slide',
            closable: false,
            iframeMaxWidth: '80%',
            download: false,
            thumbnail: true
        });
    }


    function initIsotope() {
        if ($('.insta-wrapper').length) {
            $('.insta-wrapper').each(function () {
                var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.insta-item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.insta-item',
                        gutterWidth: 0
                    }
                });
            });
        }
    }

    function makeSquareImages( $imagesSelector ) {
        var $imagesWidth = $imagesSelector.innerWidth();
        $imagesSelector.each( function() {
            $(this).innerHeight( $imagesWidth );
        });
    }

    $(window).on('load resize orientationchange', function() {
        // make square images for inline team
        if($('.insta-wrapper .insta-item').length){
            $('.insta-wrapper .insta-item').each(function() {
                makeSquareImages( $(this) );
            });

        }
        setTimeout(initIsotope, 200);
    });

})(jQuery, window, document);