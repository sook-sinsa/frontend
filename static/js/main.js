$(document).ready(function(){
    var jbOffset = $('.nonfixed' ).offset();
    console.log(jbOffset);
    $(window).scroll(function(){
      if ($(document).scrollTop() > jbOffset.top ) {
        $('.nonfixed').addClass('fixed');
      }
      else {
        $('.nonfixed' ).removeClass('fixed');
      }
    });
  });
