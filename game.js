// //https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics

const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

context.translate(width / 2, height / 2);

context.fillStyle = 'rgb(200, 200, 200)';
context.fillRect(-(width / 2), -(height / 2), width, height);

let squareLength = width > height ? height * 0.45 : width * 0.45;
let buffer = width > height ? height * 0.01 : width * 0.01;
let squareLengthBuffer = buffer + squareLength;

let mouseX;
let mouseY;
let mouseOverGreen = false;
let mouseOverRed = false;
let mouseOverBlue = false;
let mouseOverYellow = false;

document.onmousemove = function (e) {
    mouseX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

    mouseX = mouseX - (width / 2);
    mouseY = mouseY - (height / 2);

    mouseOverGreen = mouseX <= -buffer && mouseX >= -squareLengthBuffer && mouseY <= -buffer && mouseY >= -squareLengthBuffer;
    mouseOverRed = mouseX >= buffer && mouseX <= squareLengthBuffer && mouseY <= -buffer && mouseY >= -squareLengthBuffer;
    mouseOverBlue = mouseX >= buffer && mouseX <= squareLengthBuffer && mouseY >= buffer && mouseY <= squareLengthBuffer;
    mouseOverYellow = mouseX <= -buffer && mouseX >= -squareLengthBuffer && mouseY >= buffer && mouseY <= squareLengthBuffer;
}

function draw() {

    // background
    context.fillStyle = 'rgb(200, 200, 200)';
    context.fillRect(-(width / 2), -(height / 2), width, height);

    // green top left
    context.fillStyle = mouseOverGreen ? 'rgb(0, 255, 0, 1.0)' : 'rgb(0, 255, 0, 0.8)';
    context.fillRect(-squareLengthBuffer, -squareLengthBuffer, squareLength, squareLength);

    // red top right
    context.fillStyle = mouseOverRed ? 'rgb(255, 0, 0, 1.0)' : 'rgb(255, 0, 0, 0.8)';
    context.fillRect(buffer, -squareLengthBuffer, squareLength, squareLength)

    // blue bottom right
    context.fillStyle = mouseOverBlue ? 'rgb(0, 0, 255, 1.0)' : 'rgb(0, 0, 255, 0.8)';
    context.fillRect(buffer, buffer, squareLength, squareLength);

    // yellow bottom left
    context.fillStyle = mouseOverYellow ? 'rgb(255, 255, 0, 1.0)' : 'rgb(255, 255, 0, 0.8)';
    context.fillRect(-squareLengthBuffer, buffer, squareLength, squareLength)

    requestAnimationFrame(draw);
}

draw();
