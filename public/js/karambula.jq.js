jQuery.noConflict();
jQuery(function($){
      google.setOnLoadCallback(init());
      vegid=0;
      $('.thumbnail').click(function() {
            if (mystickybar.currentstate === 'show' && vegid === latestV[$('.thumbnail').index(this)].VegCode) {
                mystickybar.toggle();
            }
            else {
                vegid=latestV[$('.thumbnail').index(this)].VegCode
                drawChart(vegid)
            }

      });

    $( window ).on( "orientationchange", function( event ) {
        if (mystickybar.currentstate === 'hide') {
            drawChart(currentPick);
            mystickybar.toggle();
        }
        else {
            drawChart(currentPick);
        }
    });

    $('#search').keyup(function(event){
        var keyCode = event.which; // check which key was pressed
        var term = $(this).val();
        $('.row').children().hide(); // hide all
        $('.row').children(':Contains("' + term + '")').show(); // toggle based on term
    });



    $('.open-popup-link').magnificPopup({
        type:'inline',
        midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    });

    $('.thumbnail').equalHeights(201, 201); //201 for future reference


});


jQuery.expr[':'].Contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

