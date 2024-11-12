;(function($, window, document, undefined) {
    'use strict';


    $('.hover span').on('click', function() {
        var $t = $(this);
        $t.siblings('.list').slideToggle(300);
        $t.toggleClass('active');
    });

    var lastClass = 'default';

    $('.hover .list li').on('click', function() {
        var tx = $(this).text();
        var hoverClass = $(this).attr('data-hover');
        if($('.light-gallery').length){
            $('.light-gallery').each(function(index){
                $(this).find('.gallery-item-wrap').removeClass(lastClass);
                lastClass = hoverClass;
                $(this).find('.gallery-item-wrap').addClass(hoverClass);
            })
        }
        $('.hover span').text(tx);
        $(this).parents('.list').toggle();
        $('.hover span').toggleClass('active');
    });


    if($('#toggle-demos').length){
        $('#toggle-demos').on('click', function () {
            $('.thb-demo-holder').addClass('active');
        });
    }

    if($('.thb-demo-holder svg').length){
        $('.thb-demo-holder svg').on('click', function () {
            $('.thb-demo-holder').removeClass('active');
        });
    }



    $(window).on('load', function () {
        $('.thb-demo-holder .row')
    })



})(jQuery, window, document);
