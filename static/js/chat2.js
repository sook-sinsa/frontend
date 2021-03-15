
      var socket = io.connect('http://203.252.195.236:5000'); 
      var decide = 0;
      socket.on( 'connect', function() {
        socket.emit( 'my event', {
          data: 'User Connected'
        } )
        $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'웰컴블록<br>시작<br>종료'+'</div>' )
        var form = $( 'form' ).on( 'submit', function( e ) {
          e.preventDefault()
          let user_input = $( 'input.message' ).val()
          socket.emit( 'my event', {
            user_name : 'user',
            message : user_input
          } )
          $( 'input.message' ).val( '' ).focus()
        } )
      } )
      socket.on( 'my response', function( msg ) {
        console.log( msg )
        if( typeof msg.user_name !== 'undefined' ) {
          $( 'div.message_holder' ).append( '<div class="msgbox">'+msg.message+'</div>' )
          if(msg.message == '시작'){
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'입력 : 사진'+'</div>' )
            decide = 1;
          }
          else if(msg.message == '종료'){
            endChat();
          }

          else if(msg.message == '사진' && decide==1){
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'색상 : color<br>종류 : category'+'</div>' )
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'추천1<br><a target="_blank" href="http://www.google.com">go to page</a>'+'</div>' )
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'결과만족 y/n'+'</div>' )
            decide = 2
          }

          else if(msg.message == 'n' && decide==2){
            endChat();
          }
          else if(msg.message == 'y' && decide==2){
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'추천된 의류를 기반으로 제공 중인 추가 기능들을 사용해 보시겠습니까?<br>브랜드 : 입력하신 브랜드의 시로운 추천 결과를 보여 드립니다.<br>날씨 : 오늘 날씨에 해당 의류가 적한하지 알려 드립니다.<br>가격 : 입력하신 가격대의 새로운 추천 결과를 보여 드립니다.<br>괜찮아요 : 메인 화면으로 이동합니다.'+'</div>' )
            decide = 3
          }

          else if(msg.message == '가격' && decide==3){
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'원하시는 가격대를 숫자로 입력하십시오.'+'</div>' )
            price=parseInt(msg.message)
	    $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align:left"><b style="color: #000">SYSTEM</b>'+'가격값은 '+price+'가격 type은'+(typeof(price))+'</div>')
            decide = 4
          }
          else if(msg.message == '날씨' && decide==3){
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'날씨 정보<br>추가로 다른 기능을 사용하시겠습니까? y/n'+'</div>' )
            decide = 4
          }
          else if(msg.message == '브랜드' && decide==3){
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'원하시는 브랜드를 한국어로 입력하십시오.'+'</div>' )
            decide =4
          }
          else if(msg.message == '괜찮아요' && decide==3){
            endChat();
          }

          else if((isNaN(price)==true)&& decide==4){//msg.message=30000부분에 DB에 없다면 으로 고쳐야함.
            // 30000원짜리가 없다고 가정
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'죄송하지만 현재 '+price+'가격대의 color category 상품이 존재하지 않습니다<br>추가로 다른 기능을 사용하시겠습니까? y/n'+'</div>')
            decide = 5
          }
          else if((isNaN(price)==true) && decide==4){
            // 20000원짜리가 있다고 가정
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'색상 : color<br>종류 : category'+'</div>' )
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'추천1<br><a target="_blank" href="http://www.google.com">go to page</a>'+'</div>' )
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'결과만족 y/n'+'</div>' )
            decide = 2
          }

          // else if(msg.message =='y' && decide==4){
          //   $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'날씨 결과 보여주기<br>결과만족 y/n'+'</div>' )
          //   decide = 2
          // }

          else if(msg.message=='아디다스' && decide==4){
            // 아디다스가 없다고 가정
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'죄송하지만 현재 '+msg.message+'브랜드의 color category 상품이 존재하지 않습니다<br>추가로 다른 기능을 사용하시겠습니까? y/n'+'</div>')
            decide = 5
          }

          else if(msg.message=='나이키' && decide==4){
            // 나이키가 있다고 가정
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'색상 : color<br>종류 : category'+'</div>' )
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'추천1<br><a target="_blank" href="http://www.google.com">go to page</a>'+'</div>' )
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'결과만족 y/n'+'</div>' )
            decide = 2
          }

          else if((msg.message == 'y' && decide==5)||(msg.message =='y' && decide==4)){
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'추천된 의류를 기반으로 제공 중인 추가 기능들을 사용해 보시겠습니까?<br>브랜드 : 입력하신 브랜드의 시로운 추천 결과를 보여 드립니다.<br>날씨 : 오늘 날씨에 해당 의류가 적한하지 알려 드립니다.<br>가격 : 입력하신 가격대의 새로운 추천 결과를 보여 드립니다.<br>괜찮아요 : 메인 화면으로 이동합니다.'+'</div>' )
            decide = 3
          }
          else if((msg.message == 'n' && decide==5)||(msg.message == 'n' && decide==4)){
            endChat();
          }
        }
        const $messageTextBox = $('#convBox'); 
        $messageTextBox.scrollTop($messageTextBox[0].scrollHeight - 130);
      })

      function endChat(){
        $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'이용해주셔서 감사합니다<br>3초 뒤 메인으로 이동'+'</div>' )
        setTimeout(function(){
          location.href="http://203.252.195.236:5000/";
        }, 3000);
      }


    
      


