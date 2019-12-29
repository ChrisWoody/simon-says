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

let highlightGreen = false;
let highlightRed = false;
let highlightBlue = false;
let highlightYellow = false;

let gameStarted = false;

let date = new Date();
let previous = date.getTime();
let now = date.getTime();
let delta = now - previous;

const DelayBetween = 500;
const ShowTime = 1000;
let currentDelayBetween = 0;
let currentShowTime = 0;

let showingSquare = false;
let showingSequence = false;
let gameSequenceIndex = -1; // could be used to capture both 'showing' and 'player' sequence
let gameSequence = [];
let totalSequenceCount = 1; // so number of squares to show in the sequence
let gameOver = false;

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

document.onmousedown = function (e) {

    if (showingSequence) {
        // showing the sequence of squares to the player, ignore their input
    } else if (gameOver) {
        // start a new game
        totalSequenceCount = 1;
        gameSequence = [];
        gameOver = false;
        gameSequenceIndex = -1;
        showingSequence = true;
    } else if (gameStarted) {
        // game is underway but we're not showing the sequence, check they have picked the correct square

        // crude way of handling this
        if (gameSequenceIndex == -1) {
            gameSequenceIndex = 0;
        }

        let currentSquare = gameSequence[gameSequenceIndex];
        let pickedCorrectSquare = false;
        switch (currentSquare) {
            case 1: pickedCorrectSquare = mouseOverGreen; break;
            case 2: pickedCorrectSquare = mouseOverRed; break;
            case 3: pickedCorrectSquare = mouseOverBlue; break;
            case 4: pickedCorrectSquare = mouseOverYellow; break;

            default: break;
        }

        if (pickedCorrectSquare) {
            gameSequenceIndex++;
            if (gameSequenceIndex >= gameSequence.length) {
                // they've completed the sequence, show it again with a new square added to the end
                totalSequenceCount++;
                showingSequence = true;
                gameSequenceIndex = -1;
            }
        } else {
            gameOver = true;
        }

    } else {
        gameStarted = true;
        showingSequence = true;
    }
}

function drawBackground() {
    context.fillStyle = 'rgb(200, 200, 200)';
    context.fillRect(-(width / 2), -(height / 2), width, height);
}

function drawGreen() {
    context.fillStyle = highlightGreen ? 'rgb(0, 255, 0, 1.0)' : 'rgb(0, 255, 0, 0.5)';
    context.fillRect(-squareLengthBuffer, -squareLengthBuffer, squareLength, squareLength);
}

function drawRed() {
    context.fillStyle = highlightRed ? 'rgb(255, 0, 0, 1.0)' : 'rgb(255, 0, 0, 0.5)';
    context.fillRect(buffer, -squareLengthBuffer, squareLength, squareLength)
}

function drawBlue() {
    context.fillStyle = highlightBlue ? 'rgb(0, 0, 255, 1.0)' : 'rgb(0, 0, 255, 0.5)';
    context.fillRect(buffer, buffer, squareLength, squareLength);
}

function drawYellow() {
    context.fillStyle = highlightYellow ? 'rgb(255, 255, 0, 1.0)' : 'rgb(255, 255, 0, 0.5)';
    context.fillRect(-squareLengthBuffer, buffer, squareLength, squareLength);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearHighlights() {
    highlightGreen = highlightRed = highlightBlue = highlightYellow = false;
}

function draw() {
    date = new Date();
    now = date.getTime();
    delta = now - previous;
    previous = now;

    drawBackground();
    clearHighlights();

    if (gameStarted) {
        if (gameOver) {
            highlightGreen = highlightRed = highlightBlue = highlightYellow = true;
            // should also print out the score, ie the number of i guess successful squares, so the current total count - 1
        } else if (showingSequence) {
            if (showingSquare) {
                currentShowTime += delta;
                if (currentShowTime >= ShowTime) {
                    showingSquare = false;
                    currentShowTime = 0;

                    // shown the entire sequence? if so stop showing it then wait for user to play
                    if (gameSequenceIndex + 1 >= gameSequence.length) {
                        showingSequence = false;
                        gameSequenceIndex = -1;
                    }

                } else {
                    let currentSquare = gameSequence[gameSequenceIndex];
                    switch (currentSquare) {
                        case 1: highlightGreen = true; break;
                        case 2: highlightRed = true; break;
                        case 3: highlightBlue = true; break;
                        case 4: highlightYellow = true; break;

                        default: break;
                    }
                }
            } else { // some small setup before we show a sequence BUT also increments the current square
                // could have a delay between showing squares here
                if (gameSequence.length < totalSequenceCount) {
                    gameSequence.push(getRndInteger(1, 4));
                }

                gameSequenceIndex++;
                showingSquare = true;
            }
        } else {
            // waiting for user input
        }
    }

    drawGreen();
    drawRed();
    drawBlue();
    drawYellow();

    requestAnimationFrame(draw);
}

draw();
