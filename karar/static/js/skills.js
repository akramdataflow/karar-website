// SKILLS
;(function ($, window, document, undefined) {
    'use strict';

    $(window).on('scroll', function () {
        // linear style
        if ( $('.skill-wrapper.linear').length ) {
            $('.skills').not('.active').each(function () {
                if ($(window).scrollTop() >= $(this).offset().top - $(window).height() * 1) {
                    $(this).addClass('active');
                    $(this).find('.skill').each(function () {
                        var procent = $(this).attr('data-value');
                        $(this).find('.active-line').css('width', procent + '%');
                        $(this).find('.counter').countTo();
                    }); // end each
                } // end if
            }); // end each
        }
        // numerical style
        else if ( $('.skill-wrapper.numerical').length ) {
            $('.skill-wrapper.numerical').not('.active').each(function () {
                if ($(window).scrollTop() >= $(this).offset().top - $(window).height() * 1) {
                    $(this).addClass('active');
                    $(this).find('.skill').each(function () {
                        var procent = $(this).attr('data-value');
                        $(this).find('.active-line').css('width', procent);
                        $(this).find('.skill-value').countTo();
                    });
                } // end if
            }); // end each
        } // end else if
    });
})(jQuery, window, document);