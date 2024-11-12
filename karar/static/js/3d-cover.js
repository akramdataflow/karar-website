;(function($, window, document, undefined) {
    'use strict';


    window.addEventListener("resize", function () {
        var tg3D = document.querySelectorAll('.tg-3d-cover');
        
        for ( var i = 0; i <tg3D.length; i++) {
            var futureHeight = tg3D[i].offsetWidth;
            tg3D[i].style.height = futureHeight + 'px';            
        }
    });

})(jQuery, window, document);