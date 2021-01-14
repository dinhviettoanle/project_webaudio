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
    time_start_drums = context.currentTime;
    console.log("Recording drums...");
    drums_track = [];
    is_recording_drums = true; // Activate the recording when there is a note ON signal
});


function record_drums(){
    drums_track.push({
        "time" : context.currentTime - time_start_drums,
        "note" : noteNumber
    });
}

// TODO : bug si on enregistre 2 fois

gui_play_drums.addEventListener('click', function(){
    if (is_recording_drums) {
        console.log("Finish the recording !");
        return;
    }

    if (drums_track.length <= 1){
        console.log("You may record something...");
        return;
    }

    gui_play_drums.className = "btn btn-info btn-block";
    time_play = context.currentTime;

    drums_track.forEach(element => {
        time_sample = element.time;
        let is_waiting = true;
            while(is_waiting){ // Time precision is not very accurate, but whatever...
                if (context.currentTime - time_play >= time_sample){
                    is_waiting = false;
                }
            }    
        noteOn(element.note);
    });

    gui_play_drums.className = "btn btn-outline-info btn-block";
});