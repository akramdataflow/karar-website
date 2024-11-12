jQuery( function( $ ) {

    $(window).on('load resize', function() {
        // make square images for inline team
        makeSquareImages( $('.team-members-wrap.inline .team-member') );
    });

    function makeSquareImages( $imagesSelector ) {
        var $imagesWidth = $imagesSelector.innerWidth();
        $imagesSelector.each( function() {
            $(this).innerHeight( $imagesWidth );
        });
    }
});