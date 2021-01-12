let context; // the Web Audio "context" object
let bufferLoader; // buffer

// 0. Resume audio context
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


let mini_midi_piano = 0;

// when document is ready
window.addEventListener('load', function () {
    // 1. Init AudioContext
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext(); // eslint-disable-line no-undef

    // ================= INIT DRUMS ==============
    bufferLoaderDrums = new BufferLoader(
        context,
        [
            '../samples/drums/kick.wav',
            '../samples/drums/snare.wav',
            '../samples/drums/tom_floor.wav',
            '../samples/drums/hihat_c.wav',
            '../samples/drums/tom_mid.wav',
            '../samples/drums/hihat_o.wav',
            '../samples/drums/tom_high.wav',
            '../samples/drums/crash.wav',
        ],
        function(){
            console.log('Drums Buffer loaded !');
            const gui_status = document.querySelector("#status_drums");
            gui_status.innerHTML = '<i class="fa fa-check-circle fa-2x"></i>';
        }
    );
    bufferLoaderDrums.load();

    // ================= INIT PIANO ==============
    let record_samples_piano = {};
    let list_samples_piano =  [];
    
    for (const [key, value] of Object.entries(pitch_to_file)) {
        const midi_value = Tone.Frequency(key).toMidi();
        record_samples_piano[`${midi_value}`] = `https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/samples/piano/${value}`;
    }

    for (const [key, value] of Object.entries(record_samples_piano)) {
        list_samples_piano.push(value);
    }

    min_midi_piano = Object.keys(record_samples_piano).reduce((key, v) => record_samples_piano[v] < record_samples_piano[key] ? v : key);
    bufferLoaderPiano = new BufferLoader(context, list_samples_piano, function(){
        console.log('Piano Buffer loaded !');
        const gui_status = document.querySelector("#status_piano");
        gui_status.innerHTML = '<i class="fa fa-check-circle fa-2x"></i>';
    });

    bufferLoaderPiano.load();


    // 2. Init Web Midi
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
    } else {
        console.log("No MIDI support present in your browser.    You're gonna have a bad time.");
    }
});

function finishedLoading (bufferList) {
    console.log('Buffer loaded !');
}


const pitch_to_file = {
    'A0': 'A0.wav',
    'A1': 'A1.wav',
    'A2': 'A2.wav',
    'A3': 'A3.wav',
    'A4': 'A4.wav',
    'A5': 'A5.wav',
    'A6': 'A6.wav',
    'A#0': 'As0.wav',
    'A#1': 'As1.wav',
    'A#2': 'As2.wav',
    'A#3': 'As3.wav',
    'A#4': 'As4.wav',
    'A#5': 'As5.wav',
    'A#6': 'As6.wav',
    'B0': 'B0.wav',
    'B1': 'B1.wav',
    'B2': 'B2.wav',
    'B3': 'B3.wav',
    'B4': 'B4.wav',
    'B5': 'B5.wav',
    'B6': 'B6.wav',
    'C0': 'C0.wav',
    'C1': 'C1.wav',
    'C2': 'C2.wav',
    'C3': 'C3.wav',
    'C4': 'C4.wav',
    'C5': 'C5.wav',
    'C6': 'C6.wav',
    'C7': 'C7.wav',
    'C#0': 'Cs0.wav',
    'C#1': 'Cs1.wav',
    'C#2': 'Cs2.wav',
    'C#3': 'Cs3.wav',
    'C#4': 'Cs4.wav',
    'C#5': 'Cs5.wav',
    'C#6': 'Cs6.wav',
    'D0': 'D0.wav',
    'D1': 'D1.wav',
    'D2': 'D2.wav',
    'D3': 'D3.wav',
    'D4': 'D4.wav',
    'D5': 'D5.wav',
    'D6': 'D6.wav',
    'D#0': 'Ds0.wav',
    'D#1': 'Ds1.wav',
    'D#2': 'Ds2.wav',
    'D#3': 'Ds3.wav',
    'D#4': 'Ds4.wav',
    'D#5': 'Ds5.wav',
    'D#6': 'Ds6.wav',
    'E0': 'E0.wav',
    'E1': 'E1.wav',
    'E2': 'E2.wav',
    'E3': 'E3.wav',
    'E4': 'E4.wav',
    'E5': 'E5.wav',
    'E6': 'E6.wav',
    'F0': 'F0.wav',
    'F1': 'F1.wav',
    'F2': 'F2.wav',
    'F3': 'F3.wav',
    'F4': 'F4.wav',
    'F5': 'F5.wav',
    'F6': 'F6.wav',
    'F#0': 'Fs0.wav',
    'F#1': 'Fs1.wav',
    'F#2': 'Fs2.wav',
    'F#3': 'Fs3.wav',
    'F#4': 'Fs4.wav',
    'F#5': 'Fs5.wav',
    'F#6': 'Fs6.wav',
    'G0': 'G0.wav',
    'G1': 'G1.wav',
    'G2': 'G2.wav',
    'G3': 'G3.wav',
    'G4': 'G4.wav',
    'G5': 'G5.wav',
    'G6': 'G6.wav',
    'G#0': 'Gs0.wav',
    'G#1': 'Gs1.wav',
    'G#2': 'Gs2.wav',
    'G#3': 'Gs3.wav',
    'G#4': 'Gs4.wav',
    'G#5': 'Gs5.wav',
    'G#6': 'Gs6.wav'
}