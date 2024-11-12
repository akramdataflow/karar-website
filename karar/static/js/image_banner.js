;(function ($, window, document, undefined) {
  'use strict';

  $('.btn-scroll-down').on('click', function () {
    var scroll = $(this).closest('.top-banner').outerHeight() + $(this).closest('.top-banner').offset().top;
    $('html, body').animate({
      scrollTop: scroll
    }, 600);
    return false;
  });
})(jQuery, window, document);