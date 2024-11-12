;(function ($, window, document, undefined) {
  'use strict';

  if ($('.pages-wrap').length) {
    $('.pages-wrap').each(function () {
      var self = $(this);
      var layoutM = self.attr('data-layout') || 'masonry';
      self.isotope({
        itemSelector: '.page-wrapper',
        layoutMode: layoutM,
        masonry: {
          columnWidth: '.grid-sizer'
        }
      });
    });
  }
})(jQuery, window, document);