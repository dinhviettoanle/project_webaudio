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

// when document is ready
window.addEventListener('load', function () {
    // 1. Init AudioContext
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext(); // eslint-disable-line no-undef

    // ================= BEGIN INIT DRUMS ==============
    bufferLoader = new BufferLoader(
        context,
        [
            '../samples/kick.wav',
            '../samples/snare.wav',
            '../samples/tom_floor.wav',
            '../samples/hihat_c.wav',
            '../samples/tom_mid.wav',
            '../samples/hihat_o.wav',
            '../samples/tom_high.wav',
            '../samples/crash.wav',
        ],
        finishedLoading
    );
    bufferLoader.load();

    // 2. Init Web Midi
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
    } else {
        console.log("No MIDI support present in your browser.    You're gonna have a bad time.");
    }
    // ================= END INIT DRUMS ==============
});
