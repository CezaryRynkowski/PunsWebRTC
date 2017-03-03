context = document.getElementById('canvas').getContext('2d');

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
