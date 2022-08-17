/**
 * Usage:
 * 
 * In a script tag, put in your custom code
 * After the your custom script, put in <script src="canvas.js"></script>
 * 
 * If you have a function called customUpdate(), it will be called on the interval before any of the draw functions
 * If you have a function called customDraw(), it will be called after update on the same interval. customDraw() is called after centering 0,0 at the center of the screen
 * If you have a function called customUI(), it will be called after customDraw() in screen space
 * 
 * If you set a variable called ignoreEvents to something truthy, events will be ignored
 * If you set a variable called tickOnce to something truthy, the functions will only be called once.
 */



 document.body.innerHTML += "<canvas id='canv' oncontextmenu='return false;'></canvas>";
 document.body.style.setProperty('margin', '0px');
 document.documentElement.style.setProperty('margin', '0px'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object
 document.documentElement.style.setProperty('overflow', 'hidden'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object
 
 document.getElementById('canv').addEventListener('mousemove', mouseMove);
 document.getElementById('canv').addEventListener('mousedown', mouseDown);
 document.getElementById('canv').addEventListener('mouseup', mouseUp);
 document.getElementById('canv').addEventListener('mousewheel', mouseWheel);
 
 
 let options = {};
 
 options.width = 0;  //Will store the width of the canvas
 options.height = 0; //Will store the hegiht of the canvas
 
 options.cameraCenterX = 0; //The x position the camera is looking at
 options.cameraCenterY = 0; //The y position the camera is looking at
 
 options.isMouseDown = false; //True if the mouse is down
 
 options.lastMouseX = 0;
 options.lastMouseY = 0;
 
 options.cameraZoom = 1;

 options.fillColor = "lightgray"
 

 
 //options.ignoreEvents = true;
 //options.tickOne = true;
 
 ///This gets called once when the page is completetly loaded.
 ///Think main()
 function initialBoot() {
 
   //Call the firstUpdate function if it exists (only called once)
   if (typeof firstUpdate === "function")
     firstUpdate(options);
 
   ///Update the model
   update(options);
 
   ///Start a timer
   if (typeof options.tickOnce !== 'undefined' && options.tickOnce)
     setTimeout(tick, 33)
   else
     setInterval(tick, 33);    								///Initialize the timer
 }
 
 ///This gets called evertime the timer ticks
 function tick() {
 
   ///Respond differently based on the game state
   //timerID = setTimeout(tick, 33);    ///Restart the timer
 
   var currentTime = new Date();       ///Get the current time
   var now = currentTime.getTime();    ///Get the current time in milliseconds
 
   //Update the global model
   update();
 
 
   drawCanvas();
 }
 
 ///This gets called whenever the window size changes and the 
 ///canvas neends to adjust.
 ///This also adjusts the content pane
 function update() {
 
   ///Make sure everything is the right size
   canvas = document.getElementById("canv");   ///Get the canvas object
 
   options.width = window.innerWidth;
   options.height = window.innerHeight;
 
   canvas.width = options.width;
   canvas.height = options.height;
 
   if (typeof customUpdate === "function") {
     customUpdate(options, 33/1000);
   }
 
   drawCanvas();       ///Draw the canvas
 }
 
 ///Called whenever the canvas needs to be redrawn
 function drawCanvas() {
 
   ///Grab the canvas so we can draw on it
   var ctx = canvas.getContext("2d");      ///Get the canvas context
 
   ///Clear the rectangles
   ctx.fillStyle = options.fillColor;
   ctx.fillRect(0, 0, canvas.width, canvas.height);
 
   ctx.save();
 
   ctx.translate(options.width / 2 - options.cameraCenterX, options.height / 2 - options.cameraCenterY);
   ctx.scale(options.cameraZoom, options.cameraZoom);
 
 
 
   if (typeof customDraw === "function") {
     customDraw(ctx, options);
   }
 
   ctx.restore();
 
   if (typeof customUI === "function") {
     customUI(ctx, options);
   }
 
 }
 
 
 
 
 
 function mouseMove(e) {
   if (noEvents()) return;
   let currentMouseX = e.clientX;
   let currentMouseY = e.clientY;
 
   if (options.isMouseDown) {
     let diffX = currentMouseX - lastMouseX;
     let diffY = currentMouseY - lastMouseY;
 
     options.cameraCenterX -= diffX;
     options.cameraCenterY -= diffY;
   }
   lastMouseX = e.clientX;
   lastMouseY = e.clientY;
 }
 
 function mouseDown(e) {
   if (noEvents()) return;
   let currentMouseX = e.clientX;
   let currentMouseY = e.clientY;
 
 
   lastMouseX = e.clientX;
   lastMouseY = e.clientY;
   options.isMouseDown = true;
 }
 
 function mouseUp(e) {
   if (noEvents()) return;
   let currentMouseX = e.clientX;
   let currentMouseY = e.clientY;
 
   lastMouseX = e.clientX;
   lastMouseY = e.clientY;
   options.isMouseDown = false
 }
 
 function mouseWheel(e) {
   if (noEvents()) return;
 
   //Figure out the current world space coordinate
   let x = e.clientX - (options.width / 2 - options.cameraCenterX);
   let y = e.clientY - (options.height / 2 - options.cameraCenterY)
   x /= options.cameraZoom;
   y /= options.cameraZoom;
   //x -= (width/2 - options.cameraCenterX);
   //y -= (height/2 - options.cameraCenterY);
 
   if (e.wheelDelta > 0) {
     options.cameraZoom *= 1.1;
   }
   else if (e.wheelDelta < 0) {
     options.cameraZoom /= 1.1;
   }
 
   //Now figure out what the new world space coordinate has changed to
 
   let x2 = e.clientX - (options.width / 2 - options.cameraCenterX);
   let y2 = e.clientY - (options.height / 2 - options.cameraCenterY);
   x2 /= options.cameraZoom;
   y2 /= options.cameraZoom;
   //x2 -= (width/2 - options.cameraCenterX);
   //y2 -= (height/2 - options.cameraCenterY);
 
   options.cameraCenterX -= x2 - x;
   options.cameraCenterY -= y2 - y;
 }
 
 function noEvents() {
   return (typeof options.ignoreEvents !== "undefined" && options.ignoreEvents)
 }
 
 
 initialBoot();