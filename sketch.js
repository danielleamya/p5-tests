let mode = 1;
let sample, loop;

let permissionGranted = false
let nonios13device = false

let fft, filter, freq, reverb, drywet;
let hue, sat, bri;


function preload(){
  if (mode == 1){
    sample = loadSound("samples/rhythmic-sample.wav");
  } else if (mode == 2){
    sample = loadSound("samples/sample-2.mp3");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
    if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        // it needs to be a user gesture (requirement) in this case, click
        let askButton = createButton("Click to allow acess to sensors")
        askButton.style("font-size", "24px")
        askButton.center()
        askButton.mousePressed(onAskButtonClicked)
        throw error // keep the promise chain as rejected
      })
      .then(() => {
        // this runs on subsequent visits
        permissionGranted = true
      })
  } else {
    // it's up to you how to handle non ios 13 devices
    background(0, 255, 0)
    text("Sensor Access Granted, not iOS 13", 50, 50)
    nonios13device = true
    permissionGranted = true
  }
  
  if (mode == 1){
      mode1_setup();
  }
}
  
function draw() {
  if(permissionGranted){
    if (mode == 1){
      mode1_draw();
    }
  } 
  

}

function onAskButtonClicked() {
  DeviceOrientationEvent.requestPermission().then(response => {
    if (response === 'granted') {
      permissionGranted = true
    } else {
      permissionGranted = false
    }
    this.remove()
  }).catch(console.error)
}

function touchEnded(){
  loop = !loop
  if(loop){
      sample.loop();
  } else {
    sample.stop();
  }
}

function mode1_setup(){
  fft = new p5.FFT();
  
  reverb = new p5.Reverb();
  reverb.process(sample, 5)
  
  filter = new p5.LowPass();
  sample.disconnect();
  sample.connect(filter);
  
  colorMode(HSB);
  hue = random(360);
  sat = random(100);
}

function mode1_draw(){
  
  drywet = map(rotationX, 0, 180, 0, 100);
  //drywet = constrain(drywet, 0, 100)
  reverb.drywet(drywet)
  
  freq = map(rotationX, 0, 180, 0, 22050);
  //freq = constrain(freq, 0, 22050)
  filter.freq(freq);

  bri = map(rotationX, -90, 90, 0, 100)
  bri = constrain(bri, 0, 100);
  background(hue, sat, bri)
  
  textSize(72);
  text("Rotation X: " + rotationX, 100, 100);
  text("Rotation Y: " + rotationY, 100, 200);
  text("Rotation Z: " + rotationZ, 100, 300);
  
  text("Accelerometer X: " + accelerationX, 100, 450);
  text("Accelerometer Y: " + accelerationY, 100, 550);
  text("Accelerometer Z: " + accelerationZ, 100, 650);
  
}