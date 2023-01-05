let loopBeat;
let bassSynth;
let polySynth;
let monoSynth;
let fmSynth;
let pluckSynth;
let synth;

let counter;

let Notes=[];

let playnoteR;
let playnoteG;
let playnoteB;

let input; 
let img;

let x = 0;
let y = 0;

// GUI variables
var gui_lock= 0;
var visible = true;
var gui_controls;
var PixelSound = false;
var BPM = 100;
var BPMMin = 10;
var BPMMax = 400;
var Rchannel = true;
var Gchannel = true;
var Bchannel = true;
var Achannel = false;
var Direction = false; 

//preload images
// function preload(){
//   img= loadImage('test.jpg');
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SETUP

function setup() {

  //create GUI on or off (0 or 1)
 if (gui_lock == 0){
  // Create Layout GUI
  gui_controls = createGui('Listen to the Image').setPosition(windowWidth-220,windowHeight-220);

  //p5.gui.js automatically identifies the type of UI element based on variable value. so we simply add them to our GUI.
  gui_controls.addGlobals('PixelSound', 'BPM','Rchannel','Gchannel','Bchannel','Achannel','Direction'); // Adding UI elements

  gui_lock++;
  }  

  //notes C to B 
  let notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  
  //Notes: full array for notes C1 to B4, four octave 
  for (let i=1; i<5; i++){
    for (let j=0; j<12;j++){
     Notes.push(notes[j]+str(i));
    }
  }

  counter=0;
  
  //call instruments from tone.js 
  //can be customized by inserting key value mapping 
  polySynth = new Tone.PolySynth().toMaster();
  synth = new Tone.Synth().toMaster();
  fmSynth = new Tone.FMSynth().toMaster();
  pluckSynth = new Tone.PluckSynth().toMaster();
  bassSynth = new Tone.MembraneSynth().toMaster();
  monoSynth = new Tone.MonoSynth({ 
      envelope:{
        decay:0.1
      } 
       }).toMaster();

//change speed
  loopBeat = new Tone.Loop(song,'16n');
  

  // using transport in BPM slider
  Tone.Transport.bpm.value = BPM;

  Tone.Transport.start();
  loopBeat.start(0);
  
  createCanvas(300, 300);
  img = loadImage('test2.png');
  
  //   createCanvas(300, 300);
  // img = loadImage('https://happycoding.io/images/stanley-1.jpg');
  
  //get image input from user 
  // input = createFileInput(handleFile);
  // input.position(0, 0);
  
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SONG

//map each channel to a different tone.js instrument 

function song(time) {

  if (PixelSound==true){
    if(Rchannel==true){
      polySynth.triggerAttackRelease(playnoteR, '32n', time);
    }
    if(Gchannel==true){
      synth.triggerAttackRelease(playnoteG, '32n', time);
    }
    if(Bchannel==true){
      fmSynth.triggerAttackRelease(playnoteB, '32n', time); //change this instrument
    }
    if(Achannel==true){
      pluckSynth.triggerAttackRelease(playnoteA, '32n', time);
    }
  }
//   console.log(time);

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DRAW

function draw() {
  
  //pixel selection to sonify 
  image(img, 0, 0);

  // background(255);

  // if (img) {
  //   image(img, 0, 0, width, height);
  // }

  
  loadPixels();
  
  if (Direction==true){
    x=(x+1)%width;
    if (x==width-1){
      y=(y+1)%height;  
    }
  }
  else{
    y=(y+1)%height;
    if (y==height-1){
      x=(x+1)%width;  
    }
  }


  
  // horizontal direction (pixel-by-pixel)
  // x=(x+1)%width;
  // if (x==width-1){
  //   y=(y+1)%height;  
  // }
 
  // vertical direction (pixel-by-pixel)
 
  //   y=(y+1)%height;
  // if (y==height-1){
  //   x=(x+1)%width;  
  // }
  
  //changes color of pixel that is being sonify to red
  let red = color(255, 0, 0);
  set(x,y,red);

  //expand red selected pixel to a bigger square
  for (i=0; i<8; i++){
    for (j=0;j<8; j++){
      set(x+i,y+j,red)
    }
  }
  updatePixels();
  
  // Get the RGBA
  let c = img.get(x, y);


  
  //////playnote = R value in image
  
  //calling R in image object, c 
  //c = color [R,G,B,A]
  let R=c[0];
  let G =c[1];
  let B =c[2];
  let A =c[3];
  
  //R = 256 possible pixels 0-255; 48 notes C1-B4; 
  //to equally map pixels to notes available, 256/48=5.33
  //one sound note is mapped to 5.33 red color pixels
  //notes to pixel multiply; pixel to notes divide 
  //C1 colornotes [0] * 5.33= 0 (min of 0 to 5.33)
  //C#1 colornotes [1]*5.33 = 5.33 (min of range, 5.33 to 10.66)
  // if 4 < 5.33 = colornotes [0];
  // 4/5.33=0.75; floor 0.75 = 0; colornote[0]
  // 200/5.33 = 37.5; floor 37; colornote [37]
  
  //0-5: C1
  //6-10: C#1 
  //11-15: D1
  //16-20:D#1
  
  playnoteR= Notes[floor(R/5.33)];
  playnoteG= Notes[floor(G/5.33)];
  playnoteB= Notes[floor(B/5.33)];
  playnoteA= Notes[floor(A/5.33)];
    
  // console.log(R);
  
  //connect bpm slider to bpm attribute
  Tone.Transport.bpm.rampTo(BPM, 0.001);

/////for dynamic input 
// function handleFile(file) {
//   print(file);
//   if (file.type === 'image') {
//     img = createImg(file.data, '');
//   } else {
//     img = null;
//   }
// }
}
