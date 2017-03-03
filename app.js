'use strict';

var context = document.getElementById('canvas').getContext('2d');

var canvas = document.querySelector('canvas');
var video = document.querySelector('video');

var stream = canvas.captureStream(25); // 25 FPS
console.log('Got stream from canvas');
var pc1;
var pc2;
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};


call();

function call() {
	console.log('Starting call');
	var videoTracks = stream.getVideoTracks();
  if (videoTracks.length > 0) {
    console.log('Using video device: ' + videoTracks[0].label);
  }
	var servers = null;
  pc1 = new RTCPeerConnection(servers);
  console.log('Created local peer connection object pc1');
  pc1.onicecandidate = function(e) {
    onIceCandidate(pc1, e);
  };
  pc2 = new RTCPeerConnection(servers);
  console.log('Created remote peer connection object pc2');
  pc2.onicecandidate = function(e) {
    onIceCandidate(pc2, e);
  };
  pc1.oniceconnectionstatechange = function(e) {
    onIceStateChange(pc1, e);
  };
  pc2.oniceconnectionstatechange = function(e) {
    onIceStateChange(pc2, e);
  };
  pc2.onaddstream = gotRemoteStream;

  pc1.addStream(stream);
  console.log('Added local stream to pc1');

  console.log('pc1 createOffer start');
  pc1.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError,
      offerOptions);
}

function onCreateSessionDescriptionError(error) {
  console.log('Failed to create session description: ' + error.toString());
}

function onCreateOfferSuccess(desc) {
  console.log('Offer from pc1\n' + desc.sdp);
  console.log('pc1 setLocalDescription start');
  pc1.setLocalDescription(desc, function() {
    onSetLocalSuccess(pc1);
  }, onSetSessionDescriptionError);
  console.log('pc2 setRemoteDescription start');
  pc2.setRemoteDescription(desc, function() {
    onSetRemoteSuccess(pc2);
  }, onSetSessionDescriptionError);
  console.log('pc2 createAnswer start');
  pc2.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
}

function onSetLocalSuccess(pc) {
  console.log(getName(pc) + ' setLocalDescription complete');
}

function onSetRemoteSuccess(pc) {
  console.log(getName(pc) + ' setRemoteDescription complete');
}

function onSetSessionDescriptionError(error) {
  console.log('Failed to set session description: ' + error.toString());
}

function gotRemoteStream(e) {
  video.srcObject = e.stream;
  console.log('pc2 received remote stream');
}

function onCreateAnswerSuccess(desc) {
  console.log('Answer from pc2:\n' + desc.sdp);
  console.log('pc2 setLocalDescription start');
  pc2.setLocalDescription(desc, function() {
    onSetLocalSuccess(pc2);
  }, onSetSessionDescriptionError);
  console.log('pc1 setRemoteDescription start');
  pc1.setRemoteDescription(desc, function() {
    onSetRemoteSuccess(pc1);
  }, onSetSessionDescriptionError);
}

function onIceCandidate(pc, event) {
  getOtherPc(pc).addIceCandidate(event.candidate)
  .then(
    function() {
      onAddIceCandidateSuccess(pc);
    },
    function(err) {
      onAddIceCandidateError(pc, err);
    }
  );
  console.log(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
      event.candidate.candidate : '(null)'));
}

function onAddIceCandidateSuccess(pc) {
  console.log(getName(pc) + ' addIceCandidate success');
}

function onAddIceCandidateError(pc, error) {
  console.log(getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
}

function onIceStateChange(pc, event) {
  if (pc) {
    console.log(getName(pc) + ' ICE state: ' + pc.iceConnectionState);
    console.log('ICE state change event: ', event);
  }
}

function getName(pc) {
  return (pc === pc1) ? 'pc1' : 'pc2';
}

function getOtherPc(pc) {
  return (pc === pc1) ? pc2 : pc1;
}

/*DRAWING*/
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var clickSize = new Array();
var paint; //bool

var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var curColor = colorPurple;
var curSize = "normal";

function addClick(x, y, dragging){
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
	clickColor.push(curColor);
	clickSize.push(curSize);
}

$('#canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(mouseX, mouseY);
  redraw();
});

$('#canvas').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#canvas').mouseup(function(e){
  paint = false;
});

$('#canvas').mouseleave(function(e){
  paint = false;
});

$('#purpleColorBtn').click(function(e){
	curColor = colorPurple;
});
$('#greenColorBtn').click(function(e){
	curColor = colorGreen;
});
$('#yellowColorBtn').click(function(e){
	curColor = colorYellow;
});
$('#brownColorBtn').click(function(e){
	curColor = colorBrown;
});
$('#smallSizeBtn').click(function(e){
	curSize = "small";
});
$('#normalSizeBtn').click(function(e){
	curSize = "normal";
});
$('#largeSizeBtn').click(function(e){
	curSize = "large";
});
$('#hugeSizeBtn').click(function(e){
	curSize = "huge";
});

$('#clearButton').click(function (e) {
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	ClearCanvas();
});

function ClearCanvas() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	var radius;
  context.lineJoin = "round";

  for(var i=0; i < clickX.length; i++) {

switch (clickSize[i]) {
	case "small":
		radius = 2;
	break;
	case "normal":
		radius = 5;
	break;
	case "large":
		radius=10;
	break;
	case "huge":
		radius = 20;
	break;
	default:
		radius = 5;
}

    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
		 context.strokeStyle = clickColor[i];
		 context.lineWidth = radius;
     context.stroke();
  }
}
