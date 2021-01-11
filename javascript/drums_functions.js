function note_on_drums(noteNumber) {
    const Cbase = 36; // MIDI Note as the root C
    switch (noteNumber) {
        case Cbase:
            playSound(bufferLoaderDrums.bufferList[0]); // Kick
            break;
        case Cbase+4:
            playSound(bufferLoaderDrums.bufferList[1]); // Snare
            break;
        case Cbase+7:
            playSound(bufferLoaderDrums.bufferList[2]); // Tom 1
            break;
        case Cbase+8:
            playSound(bufferLoaderDrums.bufferList[3]); // Hihat Close
            break;
        case Cbase+9:
            playSound(bufferLoaderDrums.bufferList[4]); // Tom 2
            break;
        case Cbase+10:
            playSound(bufferLoaderDrums.bufferList[5]); // Hihat Open
            break;
        case Cbase+11:
            playSound(bufferLoaderDrums.bufferList[6]); // Tom 3
            break;
        case Cbase+13:
            playSound(bufferLoaderDrums.bufferList[7]); // Crash
            break;
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
    is_recording_drums = true;
});

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