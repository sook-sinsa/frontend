
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
        }
        const $messageTextBox = $('#convBox'); 
        $messageTextBox.scrollTop($messageTextBox[0].scrollHeight);
      })

      function endChat(){
        $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'이용해주셔서 감사합니다<br>3초 뒤 메인으로 이동'+'</div>' )
        setTimeout(function(){
          location.href="http://203.252.195.236:5000/";
        }, 3000);
      }


    
      


