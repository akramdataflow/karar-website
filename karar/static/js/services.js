;(function ($, window, document, undefined) {
    'use strict';

  $('.services.accordion .toggle').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    if ($this.next().hasClass('is-show')) {
      $this.next().removeClass('is-show');
      $this.next().slideUp(350);
        $this.find('i').removeClass('ion-minus').addClass('ion-plus');
    } else {
      $this.parent().parent().find('li .list-drop').removeClass('is-show');
      $this.parent().parent().find('li .list-drop').slideUp(350);
      $this.next().toggleClass('is-show');
      $this.next().slideToggle(350);
        $this.closest('.services.accordion').find('.toggle i').removeClass('ion-minus').addClass('ion-plus');
      $this.find('.ion-plus').addClass('ion-minus').removeClass('ion-plus');
    }
  });
function calcServicesHeight() {
  if ($('.services.tile').length) {
    $('.services.tile .item-first').each(function () {
      var elementFirstH = $(this).height();
      var element = $(this).next('.item-second');
      var textHeight = element.find('.text-wrap').outerHeight();
      if ($(window).width() > 991) {
        element.find('.img-wrap').css('height', elementFirstH - textHeight - 30 + 'px');
      } else {
        element.find('.img-wrap').css('height', 'auto');
      }
    });
  }
}

  $(window).on('load resize', function () {
      calcServicesHeight();
  });

  window.addEventListener("orientationchange", function () {
  calcServicesHeight();
});

})(jQuery, window, document);