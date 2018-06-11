var brushcolor;
var brushsize;
var brush = 0;

window.addEventListener("load", startup, false);

function startup() { //on startup set brushcolor to white, then wait for a change in the colorpicker
    brushcolor = document.querySelector('#brushColor');
    brushcolor.value = '#ffffff';
    brushcolor.addEventListener('change', changeBrushColor, false);
    brushcolor.select();

    //set the brushsize to the standard value from the input and listens for a change in the brushsize input
    brushsize = document.querySelector('#brushSize');
    brushsize.addEventListener('change', changeBrushSize, false);
    brush = brushsize.value;

    var saveBtn = document.querySelector('#saveBtn');
    saveBtn.addEventListener('click', saveDrawing, false);
}

function changeBrushColor(event) { //when there is a change in the colorpicker, grab the event and set the color of the brush to the color in the colorpicker
    var color = event.target.value;
    console.log('Changing brush to: ' + color);
    fill(color);
}

function changeBrushSize(event) { //when there is a change in the value of brush size input, set the brush variable to the value of the input
    brush = event.target.value;
    console.log('changing brushsize to ' + brush);
}

function preload() { //loads before setup() makes sure i can recieve data from server socket
    socket = io.connect(); //this page comes from server source, so no arguments are needed
    socket.on('welcome', (data) => { //displays welcome message in console to test if connection is working
        console.log(data);
    });
    socket.on('drawing',(data) => { //recieves array from server with history of drawings
        console.log(data);
        for (var index = 0; index < data.length; index++) { //for every already drawn object, draw it in the empty canvas with the data variables
            noStroke();
            fill(data[index].color);
            ellipse(data[index].x, data[index].y, data[index].size);
        }
    });
}

function setup() { //This code runs once to configure the socket.io and create the canvas
    socket.on('brush', (data) => {
        console.log(data.size);
        noStroke();
        fill(data.color);
        ellipse(data.x, data.y, data.size);
    });
    createCanvas(500,500);
    background(51);



    // var logPixelsBtn = createButton('logPixels');  see the logPixels function
    // logPixelsBtn.mousePressed(logPixels);
}

function saveDrawing() { //saves the canvas to the users pc
    console.log('Saving canvas');
    saveCanvas('myDrawing', 'jpg');
}

function mouseDragged() { //when the mouse is clicked and dragged across the canvas, send the x/y/color data to the socket
    console.log('Sending: ' + mouseX + ' ' + mouseY + ' with color: ' + brushcolor.value + ' and size: ' + brush);
    var data = {
        x: mouseX,
        y: mouseY,
        color: brushcolor.value,
        size: parseInt(brush, 10)
    }
    socket.emit('brush', data);
    //when the data is sent, draw locally
    drawEllipse();
}

// function logPixels() {           This file gets way too big and messy
//     loadPixels();
//     var pixelArray = pixels;
//     console.log(pixelArray);
//     var JSONpixels = JSON.stringify(pixelArray);
//     console.log(JSONpixels);
//     //saveJSON(JSONpixels, 'pixels.json');
// }

function drawEllipse() { //Drawing a simple ellipse at mouse location
    fill(brushcolor.value);
    noStroke();
    ellipse(mouseX, mouseY, parseInt(brush)); //brush needs  to be an int, was a string
}