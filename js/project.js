/* Global vaiables */
function fireworks(midx, midy, size) {
    var start = null;
    var duration = 2000;
    var r = 0;

    var colors = [getRandomColor(), getRandomColor()];

    function drawFrame(timestamp) {
        if (start == null) {
            start = timestamp;
        }
        var progress = timestamp - start;
        var angle = Math.random() * 361;
        ctx.beginPath();
        ctx.moveTo(midx, midy);

        r = Math.random() * size;
        ctx.lineWidth = size / 50;
        ctx.lineTo(midx + r * Math.cos(angle),
                      midy + r * Math.sin(angle));
        ctx.strokeStyle=colors[Math.floor(Math.random()*2)];
        ctx.stroke();
        if (progress < duration) {
            window.requestAnimationFrame(drawFrame);
        }
    }
    window.requestAnimationFrame(drawFrame);
    if(Math.random()*100 > 99)
      fireworks(midx, midy, size * 4);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var matrixInterval = null;
var matrix = false;

$(window).keypress(function(e) {
  if (e.keyCode === 32) {
		matrix = !matrix;
		if(matrix)
			matrixInterval = setInterval(drawMatrix, 33);
		else
			clearInterval(matrixInterval);
    $("#c").toggle();
  } else if (e.keyCode === 13) {

  }
});

$(window).click(function(e) {
  if(matrix)
    fireworks(e.pageX, e.pageY, 100);
});

$(window).mousemove(function(e) {
  if(matrix)
    fireworks(e.pageX, e.pageY, 15);
});
