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


//    reader.readAsText(file,"UTF-8");
    
//    reader.onload=function(){
//        output.innerText=reader.result;
//    }
}

// Element 에 style 한번에 오브젝트로 설정하는 함수 추가
Element.prototype.setStyle = function(styles) {
    for (var k in styles) this.style[k] = styles[k];
    return this;
};

var socket = io.connect('http://203.252.195.236:5000');

socket.on( 'connect', function() {
    socket.emit( 'my event', {
      data: 'User Connected'
    })
    var form = $( 'form' ).on( 'submit', function( e ) {
      e.preventDefault()
      let user_name = $( 'input.username' ).val()
      let user_input = $( 'input.message' ).val()
      socket.emit( 'my event', {
        user_name : user_name,
        message : user_input
      })
      $( 'input.message' ).val( '' ).focus()
    })
  })
