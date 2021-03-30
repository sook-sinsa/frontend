// javascript Module (func)

function setbtn(value) {
  const element = document.getElementById('user');
  element.innerText = value;
}

function modal(id) {
  var zIndex = 9999;
  var modal = document.getElementById(id);

  // 모달 div 뒤에 희끄무레한 레이어
  var bg = document.createElement('div');
  bg.setStyle({
      position: 'fixed',
      zIndex: zIndex,
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      // 레이어 색깔은 여기서 바꾸면 됨
      backgroundColor: 'rgba(0,0,0,0.4)'
  });
  document.body.append(bg);

  // 닫기 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
  modal.querySelector('.modal_close_btn').addEventListener('click', function() {
      bg.remove();
      modal.style.display = 'none';
  });

  modal.setStyle({
      position: 'fixed',
      display: 'block',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

      // 시꺼먼 레이어 보다 한칸 위에 보이기
      zIndex: zIndex + 1,

      // div center 정렬
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      msTransform: 'translate(-50%, -50%)',
      webkitTransform: 'translate(-50%, -50%)'
  });
}

function openImageFile(file) {
  var input = file.target;
  var reader = new FileReader();
  reader.onload = function() {
var dataURL = reader.result;
var output = document.getElementById('clothes');
output.src = dataURL;
output.width = 125;
output.height = 125;
};
  photo = input.files[0];
  reader.readAsDataURL(input.files[0]);
}

function openCamera(){
  if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
    var video = document.getElementById('video');
    video.srcObject = stream;
    video.play();
});
  }
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var video = document.getElementById('video');
  window.addEventListener("keydown", (e) => {
      if (e.code == "Enter") {
          context.drawImage(video,0,0,125,125)
      }
  })
}

function processFile(file){
  var filesToUpload = document.getElementByld('imageFile').files;
  var file = filesToUpload[0];

  var img=document.createElement("img");
  var reader=new FileReader();

  reader.onload=function(e){
      img.src = e.target.result;
      img.width=125;
img.height=125;
  }

}



// Element 에 style 한번에 오브젝트로 설정하는 함수 추가
Element.prototype.setStyle = function(styles) {
  for (var k in styles) this.style[k] = styles[k];
  return this;
};

var socket = io.connect('http://203.252.195.236:5000');
var decide = 0;
var price = '';
var clicked = 0;
function isClicked(){
  clicked = 1;
}

socket.on( 'connect', function() {
  socket.emit( 'my event', {
    data: 'User Connected'
  })
  $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'웰컴블록<br>시작<br>종료'+'</div>' )

  var form = $( 'form' ).on( 'submit', function( e ) {
      e.preventDefault()
      if(clicked == 1){

        var formData = new FormData($('#uploadForm')[0]);
        formData.append("fileObj", $("#gallery")[0].files[0]);
        console.log($('#gallery')[0].files[0]);

        $.ajax({
          type: "POST",
          url:'/predict',
          data: formData,
          dataType: 'json',
          processData: false,
          contentType: false,
          cache: false,
          success: function (data) {
            alert("completed!");
            console.log(data);
            $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM </b> '+'색상 :'+data['color']+'<br>'+'카테고리 :'+data['category']+'</div>' )

          },
          error : function(a, b, c){
            alert("failed! = ");
            console.log(a+"!"+b+"!"+"error:"+c);
          }
         });
         socket.emit( 'my event', {
          user_name : 'user',
          message : $("#gallery")[0].files[0].name
        })
        $("#test").val('')
        clicked = 0;
      }
      else if (clicked == 0 ){
        let user_input = $( '#message' ).val()
        socket.emit( 'my event', {
          user_name : 'user',
          message : user_input
        })
        $( '#message' ).val( '' ).focus()
      }
    })
});

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
          $.ajax({
            type:"POST",
            url :'/weather',
            data : {
                address = address,
                temp = temp
            },
            success : function(response){
                var address = response['address'];
                var temp = response['temp'];
                var category;
                
                if((category=="lpadding")||(category=="spadding")){
                    if(temp<=5){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
        
                    }
                    else{
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 더울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="coat")||(category=="vest")){
                    if(temp>5&&temp<=10){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp<=5){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 추울 수 있는 날씨입니다." + '</div>')
                    }
                    else if(temp>10){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 더울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="jacket")||(category=="cardigan")||(category=="hood")){
                    if(temp>10&&temp<=15){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp<=10){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 추울 수 있는 날씨입니다." + '</div>')
                    }
                    else if(temp>15){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 더울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="lsleeve")||(category=="lcollar")){
                    if(temp>15&&temp<=20){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp<=15){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 추울 수 있는 날씨입니다." + '</div>')
                    }
                    else if(temp>20){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 더울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="ssleeve")||(category=="scollar")){
                    if(temp>20&&temp<=25){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp<=20){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 추울 수 있는 날씨입니다." + '</div>')
                    }
                    else if(temp>25){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 더울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="nsleeve")){
                    if(temp>25){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp<=25){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 추울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="lpants")){
                    if(temp<=20){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp>20){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 더울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="spants")){
                    if(temp>20){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp<=20){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 추울 수 있는 날씨입니다." + '</div>')
                    }
                }
                else if((category=="skirt")||(category=="dress")||(category=="jsuit")){
                    if(temp>10){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 적절한 날씨입니다." + '</div>')
                    }
                    else if(temp<=10){
                        $('div.message_holder').append('<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> ' + "오늘의" + address + "지역 기준 기온은"+temp+"'c로"+category+"를 입기에 추울 수 있는 날씨입니다." + '</div>')
                    }
                }
            }});
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
      const $messageTextBox = $('#conversation');
      $messageTextBox.scrollTop($messageTextBox[0].scrollHeight);
    })

    function endChat(){
      $( 'div.message_holder' ).append( '<div class="msgbox" style="background: #D7DBD1; border: 3px dashed #99A89E; text-align: left"><b style="color: #000">SYSTEM</b> '+'이용해주셔서 감사합니다<br>3초 뒤 메인으로 이동'+'</div>' )
      setTimeout(function(){
        location.href="http://203.252.195.236:5000/";
      }, 3000);
    }
