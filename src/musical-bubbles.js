const wrapper = document.getElementById("main-container");

var isTouchDevice = 'ontouchstart' in document.documentElement;
var octave1 = document.getElementById('octave1');
var octave2 = document.getElementById('octave2');
var duration = document.getElementById('duration');

let dotColours = [
  '#f7eeff',
  '#f0ddff',
  '#e8cdff',
  '#e1bcff',
  '#d9abff',
  '#ae89cc',
  '#826799',
  '#574466'];

let bubbleColours = [
  '#f7eeff',
  '#f0ddff',
  '#e8cdff',
  '#fce4ec',
  '#e7dcf0',
  '#e1f5fe',
  '#f3e5f5',
  '#e0f2f1'];

initialiseMenuListeners();
loadingScreen();
fallingBubbles();

function initialiseMenuListeners() {
  for (let i=0; i < 6; i++) {
    document.getElementById("track" + i).addEventListener('click', changeTrack, false);
  }

   for (let i=0; i < 4; i++) {
      document.getElementById("instrument" + i).addEventListener('click', changeInstrument, false);
   }

  const topButton = document.getElementById("top-button");
  topButton.addEventListener('click', toggleTrackMenu, false);

  const bottomButton = document.getElementById("bottom-button");
  bottomButton.addEventListener('click', toggleInstrumentMenu, false);
}

function toggleTrackMenu() {
  let trackMenu = document.getElementById("trackmenu");
  switch (trackMenu.className) {
    case "track-menu":
      trackMenu.className = "track-menu-invisible";
      break;
    default:
      trackMenu.className = "track-menu";
      break;
  }

  alterInstrumentMenu();
}
const animateBubble = (x, colour, size) => {
  let bubbleJiggle = document.createElement("div");

  bubbleJiggle.className = "bubble-jiggle";
  bubbleJiggle.style.width = size + 'px';
  bubbleJiggle.style.height = size + 'px';
  bubbleJiggle.style.left = `${x}px`;

  let y = (((window.innerHeight > 0 ? window.innerHeight : screen.height) + size + (size * 0.3)) / size) * 100;
  bubbleJiggle.style.setProperty('--y-percent', y+'%');
  bubbleJiggle.style.zIndex = -1;
  let bubble = document.createElement("div");
  bubble.style.background = colour;

  bubble.className = "bubble";
  bubble.tabindex="0";
  bubbleJiggle.appendChild(bubble);
  wrapper.appendChild(bubbleJiggle);
  if (isTouchDevice) {
   bubbleJiggle.addEventListener("touchstart", bubbleHover, {once : true});
  } else {
    bubbleJiggle.addEventListener("mouseover", bubbleHover, {once : true});
  }

  setTimeout(() => wrapper.removeChild(bubbleJiggle), 5500);
}


async function fallingBubbles() {
  await sleep(8000);

  while (true) {
    animateBubble(randomX(), randomColour(), randomSize());
    await sleep(500);
 }
}

function randomX() {
  return Math.floor(Math.random() * ((window.innerWidth > 0)
                                     ? ((window.innerWidth/10) * 8.5) : ((screen.width/10) * 8.5)));
}

function randomColour() {
  return bubbleColours[Math.floor(Math.random() * 8)];
}

function randomSize() {
  return Math.floor(Math.random() * 125) + 25;
}

async function loadingScreen() {
 const dotContainer = document.getElementById("dot-container");

  //expand loading elements
  setTimeout(() => {
  for (let i = 0; i < dotContainer.children.length; i++) {
    let dotJiggle = dotContainer.children[i];
    let dot = dotJiggle.children[0];
    dotJiggle.style.setProperty('--x', calculateX(i, dotContainer.children.length));
    dotJiggle.style.setProperty('--y', calculateY(i, dotContainer.children.length));
    dot.style.background = dotColours[i];
    dotJiggle.classList.add('expand');
    dotContainer.classList.add('dot-container-rotate');
  }}, 2000);

  //contract loading elements
  setTimeout(() => {
  for (let i = 0; i < dotContainer.children.length; i++) {
    let dotJiggle = dotContainer.children[i];
    let dot = dotJiggle.children[0];
    dot.style.setProperty('--x', calculateX(i, dotContainer.children.length));
    dot.style.setProperty('--y', calculateY(i, dotContainer.children.length));
    dotJiggle.classList.remove('expand');
    dotJiggle.classList.add('contract-dot-jiggle');
    dot.classList.add('contract-dot');
    dotContainer.classList.remove('dot-container-rotate');
    dotContainer.classList.add('dot-container-rotate-reverse');
  }}, 7000);

  //cleanup loading elements
  setTimeout(() => wrapper.removeChild(dotContainer), 8000);
}

function calculateX(i, numOfDots) {
  var radius = 40;
  var angle = (360/numOfDots) * i;
  var x = radius * Math.sin(Math.PI * 2 * angle / 360);
  return Math.round(x * 100) / 100 + 'px';
}

function calculateY(i, numOfDots) {
  var radius = 40;
  var angle = (360/numOfDots) * i;
  var x = radius * Math.cos(Math.PI * 2 * angle / 360);
  return Math.round(x * 100) / 100 + 'px';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//music playing
var Synth = window.Synth;
var _ = window._;
const RANDOM_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
const TRACK_IDS = ["track0", "track1", "track2", "track3", "track4", "track5"];
const tracks = [["E", "D", "C", "D", "E", "E", "E",
                 "D","D","D","E","G","G",
                 "E", "D", "C", "D", "E", "E", "E",
                 "E","D","D","E","D","C"],
                 ["C", "C", "G", "G", "A", "A", "G",
                  "F", "F", "E", "E", "D", "D", "C",
                  "G", "G", "F", "F", "E", "E", "D",
                  "G", "G", "F", "F", "E", "E", "D",
                  "C", "C", "G", "G", "A", "A", "G",
                  "F", "F", "E", "E", "D", "D", "C"],
                 ["G", "C", "C", "C", "D", "E", "E",
                  "E", "D", "C", "D", "E", "C", "E",
                  "E", "F", "G", "G", "F", "E", "F",
                  "G", "E", "C", "C", "D", "E", "E",
                  "D", "C", "D", "E", "C", "G", "G",
                  "C", "C", "C", "D", "E", "E", "E",
                  "D", "C", "D", "E", "C"],
                 ["G", "G", "G", "D", "E", "E", "D",
                  "B", "B", "A", "A", "G", "D", "G",
                  "G", "G" ,"D", "E", "E", "D", "B",
                  "B", "A", "A", "G", "D", "D", "G",
                  "G", "G", "D", "D", "G", "G", "G",
                  "G", "G", "G", "G", "G", "G", "G",
                  "G", "G", "G", "G", "G", "G", "G",
                  "G", "D", "E", "E", "D", "B", "B",
                  "A", "A", "G"],
                 ["C", "C", "C", "D", "E", "E", "D",
                  "E", "F", "G", "C", "C", "C", "G",
                  "G", "G", "E", "E", "E", "C", "C",
                  "C", "G", "F", "E", "D", "C"]];

const INSTRUMENT_IDS = ["instrument0", "instrument1", "instrument2", "instrument3"];
//instrument, duration, octave
const instruments = [["organ", 2, 3],
                     ["piano", 1.5, 3],
                     ["acoustic", 0.5, 3],
                     ["edm", 0.2, 3]];
var currentNote = 0;
var totalNotes = 0;
var randomTrack = false;
var selectedTrack = tracks[0];
var selectedInstrument = instruments[0][0];
var instrumentDuration = instruments[0][1];
var instrumentOctave = instruments[0][2];
function playSynth(instrument, note, octave, duration) {
	Synth.setVolume(0.40);
  Synth.play.apply(Synth, arguments);
}

function playRandomNote() {
  playSynth(
  	selectedInstrument,
    _.sample(RANDOM_NOTES),
    _.random(2, 4),
    instrumentDuration
  );
}

function playNote() {
  playSynth(
  	selectedInstrument,
    selectedTrack[totalNotes % selectedTrack.length],
    3,
    instrumentDuration);

  totalNotes++;
}

function bubbleHover(event) {
  event.srcElement.classList.add("bubble-flare");
  randomTrack ? playRandomNote() : playNote();
}

//menu
const trackMenu = document.getElementById("trackmenu");
const instrumentMenu = document.getElementById("instrumentmenu");
const instrumentButton = document.getElementById("bottom-button");

function alterInstrumentMenu() {
  if (trackMenu.className == "track-menu" && instrumentMenu.className == "instrument-menu") {
    instrumentButton.className = "bottom-button";
    instrumentMenu.className = "instrument-menu-bottom";
  }

  if (trackMenu.className == "track-menu-invisible" && instrumentMenu.className == "instrument-menu-bottom") {
      instrumentButton.className = "instrument-button-animate";
      instrumentMenu.className = "instrument-menu-bottom-invisible";
    }
}

function toggleInstrumentMenu() {
  //if track menu is not expanded, we don't have to move the instrument menu
  if (trackMenu.className == "track-menu") {
    if (instrumentButton.className == "instrument-button" || instrumentButton.className == "instrument-button-animate") {
      instrumentButton.className = "bottom-button";
    } else {
      instrumentButton.className = "instrument-button-animate";
    }

    switch (instrumentMenu.className) {
      case "instrument-menu-bottom":
        instrumentMenu.className = "instrument-menu-bottom-invisible";
        break;
      case "instrument-menu-invisible":
      case "invisible-menu":
      case "instrument-menu-bottom-invisible":
        instrumentMenu.className = "instrument-menu-bottom";
        break;
    }
  } else {
    switch (instrumentMenu.className) {
      case "instrument-menu":
        instrumentMenu.className = "instrument-menu-invisible";
        break;
      default:
        instrumentMenu.className = "instrument-menu";
        break;
    }
  }
}

function changeTrack(event) {
  let element = event.srcElement;
  let id = event.srcElement.id;
  let index;
  index = TRACK_IDS.findIndex(track => track == id);

  if (index == 5) {
    randomTrack = true;
  } else {
    randomTrack = false;
    selectedTrack = tracks[index];
    currentNote = 0;
    totalNotes = 0;
  }

  for (let i = 0; i < trackMenu.children.length; i++) {
    let trackMenuItem = trackMenu.children[i];
    trackMenuItem.classList.remove("menu-item-selected");
  }
  element.classList.add("menu-item-selected");
}

function changeTrack(event) {
  let element = event.srcElement;
  let id = event.srcElement.id;
  let index;
  index = TRACK_IDS.findIndex(track => track == id);

  if (index == 5) {
    randomTrack = true;
  } else {
    randomTrack = false;
    selectedTrack = tracks[index];
    currentNote = 0;
    totalNotes = 0;
  }

  for (let i = 0; i < trackMenu.children.length; i++) {
    let trackMenuItem = trackMenu.children[i];
    trackMenuItem.classList.remove("menu-item-selected");
  }
  element.classList.add("menu-item-selected");

}

function changeInstrument(event) {
  let element = event.srcElement;
    let id = event.srcElement.id;
    let index;
    index = INSTRUMENT_IDS.findIndex(instrument => instrument == id);

    selectedInstrument = instruments[index][0];
    instrumentDuration = instruments[index][1];
    instrumentOctave = instruments[index][2];

    for (let i = 0; i < instrumentMenu.children.length; i++) {
      let instrumentMenuItem = instrumentMenu.children[i];
      instrumentMenuItem.classList.remove("menu-item-selected");
    }
    element.classList.add("menu-item-selected");
}