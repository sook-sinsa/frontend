// document.write('<script type="text/javascript" src='module.js '><' + '/script>');

var socket = io.connect('http://203.252.195.236:5000');
var decide = 0;
var category = " ";
var color = " ";
var price = 0;
var brand = " ";
var clicked = 0;

function isClicked() {
  clicked = 1;
}
//$(function() {
//  $("#gallery").on('change', function(){
//      readURL(this);
//  });
//});

// 시연 - 사진 로드 코드 test 중
function readURL(input) {
  if (input.files && input.files[0]) {
    
    var reader = new FileReader();
    reader.onload = function (e) {
       $('div#imgThumb').css({'margin-left':'70%', 'display':'block','width':'125px', 'height':'125px','background-size':'125px 125px',  'background-image': 'url(\"' + e.target.result + '\")'});
    }
    reader.readAsDataURL(input.files[0]);
  }
}


socket.on('connect', function() {
  socket.emit('my event', {
    data: 'Connection Succeeded'
  })
  $('div.message_holder').append('<div class="pycMessage">안녕하세요 숙명여자대학교 옷잘코 팀 챗봇입니다.<br>' + '저희는 원하는 스타일과 비슷한 옷을 추천해주는 기능을 제공하고 있어요 😆<br>' + '대화를 시작하시려면 <b style="color: blue;">시작</b>을 입력해 주세요.' + '</div>')

  var form = $('form').on('submit', function(e) {
    console.log(form)
    e.preventDefault()

    if (clicked == 1) {
      var formData = new FormData($('#uploadForm')[0]);
      formData.append("fileObj", $("#gallery")[0].files[0]);
      console.log($('#gallery')[0].files[0]);

      // result 통신 코드
      $.ajax({
        type: "POST",
        url: '/result',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        success: function(data) {
          category = data.category
          color = data.color
          $('div.message_holder').append('<div class="pycMessage">보내주신 옷은 <b style="color: black">'+ color +'</b> 색상의 <b style="color: black">' + category + '</b>입니다.<br>' + '색상과 카테고리가 모두 같은 의류를 다음과 같이 추천해 드리겠습니다.' + '</div><table><tr>')
          for (var i = 0; i < data.recommendations.length; i++) {
            $('div.message_holder').append('<td><div class="msgbox" id="recommend"><div id="thumbnail"><img src="' + data.recommendations[i].profile + '"></div><div id="info"><label for="brandName">브랜드명</label><span id="brandName">' + data.recommendations[i].brand + '</span><br><label for="itemName">상품명</label><span id="itemName">' +  data.recommendations[i].name + '</span><br><label for="itemPrice">상품 가격</label><span id="itemPrice">' + data.recommendations[i].price + '</span><span>원</span></div><button onclick="window.open(' + data.recommendations[i].url + ')"' + '>해당 링크로 이동' + '</button></div></td>')
          }
          clicked = 0;
          $('div.message_holder').append('</tr></table><div class="pycMessage">추천 결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요.' + '</div>')
        },
        error: function(data) {
          alert("failed!");
          endChat();
        }
      });

  
      socket.emit('my event', {
        user_name: 'user',
        message: $('#gallery')[0].files[0].name
      })
      $("#gallery").val('')
    } else if (clicked == 0) {
      let user_input = $('#message').val()
      socket.emit('my event', {
        user_name: 'user',
        message: user_input
      })
      $('#message').val('').focus()
    }
  })
});

socket.on('my response', function(msg) {

  if (typeof msg.user_name !== 'undefined') {
    $('div.message_holder').append('<div class="userMessage">' + msg.message + '</div>')
    if (msg.message == '시작' && decide == 0) {
      $('div.message_holder').append('<div class="pycMessage">' + '서비스를 제공하기 위해서는 사진이 필요합니다.<br>' + '사진을 등록한 후 전송 버튼을 눌러 주세요.<br>' + '결과가 나오기까지 <b style="color: black">10초 내외의 시간</b>이 걸릴 수 있습니다.' + '</div>')
      $('div.message_holder').append('<div class="userMessage" id="imgThumb"></div')
      $('div#imgThumb').css('display','none')
      decide = 1;
    } else if (msg.message == '종료' && decide == 0) {
      endChat();
    } else if (msg.message == '예' && decide == 1) {
      decide = 2;
      $('div.message_holder').append('<div class="pycMessage">' + '추천된 의류를 기반으로 제공 중인 추가 기능들을 사용해 보시겠습니까?<br><b style="color:blue">브랜드</b> : 입력하신 브랜드의 시로운 추천 결과를 보여 드립니다.<br><b style="color:blue">날씨</b> : 오늘 날씨에 해당 의류가 적한하지 알려 드립니다.<br><b style="color:blue">가격</b> : 입력하신 가격대(상한가)의 새로운 추천 결과를 보여 드립니다.<br><b style="color:blue">괜찮아요</b> : 메인 화면으로 이동합니다.<br>원하시는 옵션의 파란 글씨를 입력해주세요.' + '</div>')
    } else if (msg.message == '아니오' && decide == 1) {
      endChat();
    } else if (msg.message == '가격' && decide == 2) {
      $('div.message_holder').append('<div class="pycMessage">' + '원하시는 가격대(상한가)를 <b style="color: black">숫자</b>로 입력하십시오.' + '</div>')
      decide = 10;
    } else if (msg.message == '날씨' && decide == 2) {
      // weather 통신 코드
      $.ajax({
        type: "POST",
        url: '/weather',
        data: {},
        dataType: 'json',
        success: function(data) {
          var address = data['address'];
          var temp = data['temp'];

          if((category=="lpadding")||(category=="spadding")){
              if(temp<=5){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
              }
              else{
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 더울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="coat")||(category=="vest")){
              if(temp>5&&temp<=10){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')              
                }
              else if(temp<=5){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 추울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp>10){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 더울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="jacket")||(category=="cardigan")||(category=="hood")){
              if(temp>10&&temp<=15){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp<=10){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 추울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp>15){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 더울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="lsleeve")||(category=="lcollar")){
              if(temp>15&&temp<=20){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp<=15){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 추울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp>20){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 더울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="ssleeve")||(category=="scollar")){
              if(temp>20&&temp<=25){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp<=20){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 추울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp>25){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 더울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="nsleeve")){
              if(temp>25){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp<=25){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 추울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="lpants")){
              if(temp<=20){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp>20){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 더울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="spants")){
              if(temp>20){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp<=20){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 추울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
          else if((category=="skirt")||(category=="dress")||(category=="jsuit")){
              if(temp>10){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 적절한 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
              else if(temp<=10){
                  $('div.message_holder').append('<div class="pycMessage">' + "오늘의<b style='color: black'> " + address + "</b>지역 기준 기온은 <b style='color: black'>"+temp+"'C</b>로" + '<br><b style="color: black">' + category + "</b>를 입기에 추울 수 있는 날씨입니다." + '</div>')
                  $('div.message_holder').append('</tr></table><div class="pycMessage">결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
                }
          }
        },
        error: function(data) {
          alert("failed!");
          endChat();
        }
      })
      decide = 1;
    } else if (msg.message == '브랜드' && decide == 2) {
      $('div.message_holder').append('<div class="pycMessage">' + '원하시는 브랜드를 <b style="color: black">한글로</b> 입력하십시오.(예: 나이키)' + '</div>')
      decide = 11;
    } else if (msg.message == '괜찮아요' && decide == 2) {
      endChat();
    } else if (decide == 10) {
      price = parseInt(msg.message);
      // price 통신 코드
      $.ajax({
        type: "POST",
        url: '/price',
        data: {
          "category": category,
          "color": color,
          "price": price
        },
        dataType: 'json',
        success: function(data) {
          if (data.length != 0) {
            $('div.message_holder').append('<div class="pycMessage">입력하신 가격대(상한가)와 색상과 카테고리가 모두 같은 의류를 다음과 같이 추천해 드리겠습니다.' + '</div><table><tr>')
            for (var i = 0; i < data.length; i++) {
              $('div.message_holder').append('<td><div class="msgbox" id="recommend"><div id="thumbnail"><img src="' + data[i].profile + '"></div><div id="info"><label for="brandName">브랜드명</label><span id="brandName">' + data[i].brand + '</span><br><label for="itemName">상품명</label><span id="itemName">' +  data[i].name + '</span><br><label for="itemPrice">상품 가격</label><span id="itemPrice">' + data[i].price + '</span><span>원</span></div><button onclick="window.open(' + data[i].url + ')"' + '>해당 링크로 이동' + '</button></div></td>')
            }
            $('div.message_holder').append('</tr></table><div class="pycMessage">추천 결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
          } else {
            $('div.message_holder').append('<div class="pycMessage">' + '죄송하지만 현재 입력하신 가격대(상한가)의 <b style="color:black">' + color + ' ' + category + '</b> 상품이 존재하지 않습니다.<br>추가로 다른 기능을 사용하시겠습니까? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
          }
          decide = 1;
        },
        error: function(data) {
          alert("failed!");
          endChat();
        }
      });
    } else if (decide == 11) {
      brand = msg.message;
      // brand 통신 코드
      $.ajax({
        type: "POST",
        url: '/brand',
        data: {
          "category": category,
          "color": color,
          "brand": brand
        },
        dataType: 'json',
        success: function(data) {
          if (data.length != 0) {
            $('div.message_holder').append('<div class="pycMessage">입력하신 브랜드의 색상과 카테고리가 모두 같은 의류를 다음과 같이 추천해 드리겠습니다.' + '</div><table><tr>')
            for (var i = 0; i < data.length; i++) {
              $('div.message_holder').append('<td ><div class="msgbox" id="recommend"><div id="thumbnail"><img src="' + data[i].profile + '"></div><div id="info"><label for="brandName">브랜드명</label><span id="brandName">' + data[i].brand + '</span><br><label for="itemName">상품명</label><span id="itemName">' +  data[i].name + '</span><br><label for="itemPrice">상품 가격</label><span id="itemPrice">' + data[i].price + '</span><span>원</span></div><button onclick="window.open(' + data[i].url + ')"' + '>해당 링크로 이동' + '</button></div></td>')
            }
            $('div.message_holder').append('</tr></table><div class="pycMessage">추천 결과가 맘에 드시나요? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
          } else {
            $('div.message_holder').append('<div class="pycMessage">' + '죄송하지만 현재 입력하신 ' + brand + '의' + color + ' ' + category + '상품이 존재하지 않습니다.<br>추가로 다른 기능을 사용하시겠습니까? <b style="color:blue">예</b> 또는 <b style="color:blue">아니오</b>를 입력해주세요' + '</div>')
          }
          decide = 1;
        },
        error: function(data) {
          alert("failed!");
          endChat();
        }
      });
    }
  }
})


function autoScrolling() { window.scrollTo(0,document.getElementsByClassName('message_holder')[0].scrollHeight-200); }
setInterval(autoScrolling, 1000); 

function endChat() {
  $('div.message_holder').append('<div class="pycMessage">' + '이용해주셔서 감사합니다.<br>3초 뒤 메인 화면으로 이동합니다.' + '</div>')
  setTimeout(function() {
    location.href = "http://203.252.195.236:5000/";
  }, 3500);
}
