/* ==================== PLAY ON KEYBOARD ====================== */

const AVAILABLE_DRUMS = {
    36 : "C#3",
    40 : "E3",
    43 : "G3",
    44 : "G#3",
    45 : "A3",
    46 : "A#3",
    47 : "B3",
    49 : "C#4",
}

function note_on_drums(noteNumber) {
    if (drums_sampler_is_loaded && noteNumber in AVAILABLE_DRUMS) {  
        sampler_drums.triggerAttackRelease([AVAILABLE_DRUMS[noteNumber]], 4)
    }
}


/* ==================== RECORDING ====================== */

const gui_record_drums = document.querySelector('#button-record_drums');
const gui_play_drums = document.querySelector('#button-play_drums');


let drums_track = [];
let time_start_drums = 0;
let is_recording_drums = false;



gui_record_drums.addEventListener('click', function() {
    change_gui_record_drums();
    time_start_drums = Tone.now();
    console.log("Recording drums...");
    drums_track = [];
    is_recording_drums = true; // Activate the recording when there is a note ON signal
});


function on_record_drums(noteNumber){
    drums_track.push({
        "time" : Tone.now() - time_start_drums,
        "name" : noteNumber
    });
}

gui_play_drums.addEventListener('click', function(){
    const time_start_play = Tone.now();
    drums_track.forEach(note => {
        sampler_drums.triggerAttackRelease(AVAILABLE_DRUMS[note.name], 4, note.time + time_start_play);
    });
});