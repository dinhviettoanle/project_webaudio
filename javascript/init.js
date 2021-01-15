let context; // the Web Audio "context" object
let bufferLoader; // buffer

// TODO : gerer les gains des pistes

let drums_track = null;

let piano_sampler_is_loaded = false;
let sampler_piano = null;

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

// when document is ready
window.addEventListener('load', function () {
    // 1. Init AudioContext
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext(); // eslint-disable-line no-undef

    Tone.context.lookAhead = 0;

    // ================= INIT DRUMS ==============

    drums_track = new Track({
        name : "drums",
        samples: {
            "C2": "kick.wav",
            "E2": "snare.wav",
            "G2": "tom_floor.wav",
            "G#2": "hihat_c.wav",
            "A2": "tom_mid.wav",
            "A#2": "hihat_o.wav",
            "B2": "tom_high.wav",
            "C#3": "crash.wav",
        },
        release : 1,
        base_url : "../samples/drums/",
        available_notes : [36, 40, 43, 44, 45, 46, 47, 49],
        channel : 10,
        gain : 100,
    });

    // ================= INIT PIANO ==============
    let record_samples_piano = {};
    
    for (const [key, value] of Object.entries(pitch_to_file)) {
        const midi_value = Tone.Frequency(key).toMidi();
        record_samples_piano[`${midi_value}`] = `${value}`;
    }

    piano_track = new Track({
        name : "piano",
        samples: record_samples_piano,
        release : 1,
        base_url : "https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/samples/piano/",
        available_notes : [...Array(100).keys()],
        channel : 1,
        gain : 50,
    });

    // ================== INIT GUITAR ==============
    let record_samples_guitar = {};
    
    for (const [key, value] of Object.entries(pitch_to_file)) {
        const midi_value = Tone.Frequency(key).toMidi();
        if (midi_value > 26 && midi_value < 63){
            record_samples_guitar[`${midi_value}`] = `${value}`;
        }
    }

    
    guitar_track = new Track({
        name : "guitar",
        samples: record_samples_guitar,
        release : 1,
        base_url : "https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/samples/guitar-acoustic/",
        available_notes : [...Array(100).keys()],
        channel : 2,
        gain : 100,
    });
    


    // =================== INIT BASS ==================
    let record_samples_bass = {};
    
    for (const [key, value] of Object.entries(pitch_to_file)) {
        const midi_value = Tone.Frequency(key).toMidi();
        if (midi_value > 24 && midi_value < 56){
            record_samples_bass[`${midi_value}`] = `${value}`;
        }
    }

    
    bass_track = new Track({
        name : "bass",
        samples: record_samples_bass,
        release : 1,
        base_url : "../samples/bass/",
        available_notes : [...Array(100).keys()],
        channel : 3,
        gain : 100,
    });




    // 2. Init Web Midi
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
    } else {
        console.log("No MIDI support present in your browser.    You're gonna have a bad time.");
    }
});

// =========== RESUME AUDIO CONTEXT =================
const resume = document.querySelector('#button-resume');
let isResumed = false;


resume.addEventListener('click', function() {
    context.resume().then(() => {
        console.log("AudioContext resumed");
        resume.className = "btn btn-success btn-block";
        resume.innerHTML = "AudioContext ON";
        $('#button-resume').prop('disabled', true);
    });
});