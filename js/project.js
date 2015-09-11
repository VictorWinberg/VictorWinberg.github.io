/* Global vaiables */
//letters characters - taken from the unicode charset
var letters = ".";
//converting the string into an array of single characters
letters = letters.split("");

//drawing the characters
function drawProject() {
  clear();

	ctx.fillStyle = "#0F0"; //green text
	ctx.font = font_size + "px arial";
	//looping over drops
	for(var i = 0; i < drops.length; i++) {
		//a random letters character to print
		var text = letters[Math.floor(Math.random()*letters.length)];
		//x = i*font_size, y = value of drops[i]*font_size
		ctx.fillText(text, i*font_size, drops[i]*font_size);

		//sending the drop back to the top randomly after it has crossed the screen
		//adding a randomness to the reset to make the drops scattered on the Y axis
		if(drops[i]*font_size > c.height && Math.random() > 0.975)
			drops[i] = 0;

		//incrementing Y coordinate
		drops[i]++;
	}
}

setInterval(drawProject, 33);

$(window).click(function(e) {
  fireworks(e.pageX, e.pageY);
});

function fireworks(midx, midy) {
    var start = null;
    var duration = 1000;
    var r = 0;

    function drawFrame(timestamp) {
        if (start == null) {
            start = timestamp;
        }
        var progress = timestamp - start;
        var angle = Math.random() * 361;
        ctx.beginPath();
        ctx.moveTo(midx, midy);

        r = Math.random() * 100;
        ctx.lineWidth = 1;
        ctx.lineTo(midx + r * Math.cos(angle),
                      midy + r * Math.sin(angle));
        ctx.strokeStyle=getRandomColor();
        ctx.stroke();
        if (progress < duration) {
            window.requestAnimationFrame(drawFrame);
        }
    }

    window.requestAnimationFrame(drawFrame);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
