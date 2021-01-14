let context; // the Web Audio "context" object
let bufferLoader; // buffer

// TODO : gerer les gains des pistes

let drums_sampler_is_loaded = false;
let sampler_drums = null;

let piano_sampler_is_loaded = false;
let sampler_piano = null;

// when document is ready
window.addEventListener('load', function () {
    // 1. Init AudioContext
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext(); // eslint-disable-line no-undef

    Tone.context.lookAhead = 0;

    // ================= INIT DRUMS ==============

    sampler_drums = new Tone.Sampler({
        urls: {
            "C3": "kick.wav",
            "E3": "snare.wav",
            "G3": "tom_floor.wav",
            "G#3": "hihat_c.wav",
            "A3": "tom_mid.wav",
            "A#3": "hihat_o.wav",
            "B3": "tom_high.wav",
            "C#4": "crash.wav",
        },
        release: 1,
        baseUrl: "../samples/drums/",
        onload: () => {
            console.log('Drums Buffer loaded !');
            const gui_status = document.querySelector("#status_drums");
            gui_status.innerHTML = '<i class="fa fa-check-circle fa-2x"></i>';
            drums_sampler_is_loaded = true;
        }
    }).toDestination();

    // ================= INIT PIANO ==============
    let record_samples_piano = {};
    let list_samples_piano =  [];
    
    for (const [key, value] of Object.entries(pitch_to_file)) {
        const midi_value = Tone.Frequency(key).toMidi();
        record_samples_piano[`${midi_value}`] = `${value}`;
    }

    for (const [key, value] of Object.entries(record_samples_piano)) {
        list_samples_piano.push(value);
    }

    sampler_piano = new Tone.Sampler({
        urls: list_samples_piano,
        release: 1,
        baseUrl: "https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/samples/piano/",
        onload: () => {
            console.log('Piano Buffer loaded !');
            const gui_status = document.querySelector("#status_piano");
            gui_status.innerHTML = '<i class="fa fa-check-circle fa-2x"></i>';
            piano_sampler_is_loaded = true;
        }
    }).toDestination();





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