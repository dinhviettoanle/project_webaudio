/*
* Handle stuff about MIDI keyboard interaction
*/


let main_loop = null; // Contains all parts (metro, drums, bass, guitar, piano)


// 3. Midi callback is called if Midi is accessible
function onMIDIInit (midi) {
    console.log('MIDI ready!');

    let haveAtLeastOneDevice = false;
    let inputs = midi.inputs.values();
    let name_devices_connected = [];
    // assign Midi Event Handler for all midi Inputs (for example)
    for (let input of inputs) {
        console.log(input.name, "connected "); // id : new one is created on machine reboot or on new connection
        input.onmidimessage = midiMessageEventHandler;
        haveAtLeastOneDevice = true;
        name_devices_connected.push(input.name);
    }

    if (!haveAtLeastOneDevice) {
        console.log("No MIDI input devices present. You're gonna have a bad time."); 
    }
    else {
        name_device_gui = document.getElementsByClassName("name_device");
        for(var i = 0 ; i < name_device_gui.length ; i++) {
            name_device_gui[i].innerText = name_devices_connected[0];
        }
    }
}

// Reject Midi
function onMIDIReject (err) {
    console.log(`The MIDI system failed to start.    You're gonna have a bad time. ${err}`);
}

// 4. Event handler which receive all Midi Messages
function midiMessageEventHandler (event) {
    // 1 message MIDI = 1 byte = 1 octect = 8bits
    // [Status (message type + channel), Data 1 (note), Data 2 (velocity)]
    // let str = 'MIDI message received [' + event.data.length + ' bytes]: ';
    // for (let i = 0; i < event.data.length; i++) {
    //     str += event.data[i] + ' ';
    // }
    // console.log(str);

    // Mask off the lower nibble (MIDI channel, which we don't care about)
    // console.log("event.data[0] & 0xf0", event.data[0] & 0xf0)
    switch (event.data[0] & 240) {
        case 144:
            if (event.data[2] > 0) { // if velocity > 0, this is a note-on message
                noteOn(event.data[1], event.data[2]);
            }
            break;
        case 176:
            continuousController(event.data[1], event.data[2]);
            break;
    }
}

function continuousController (ctrlNumber, value) {
    console.log("ctrlNumber", ctrlNumber)
    if (ctrlNumber === 75) {
        filter.frequency.value = ((Math.exp(value / 127) - 1)) * freqMax;
        filterDefault = filter.frequency.value;
    }
}

// 4. play sound when note on
function noteOn (noteNumber, velocity) {
    // console.log('note on', noteNumber, velocity);
    switch (which_selected) {
        case 1 :
            piano_track.note_on(noteNumber);
            break;
        case 2 :
            guitar_track.note_on(noteNumber);
            break;
        case 3 :
            bass_track.note_on(noteNumber);
            break;
        case 10 :
            drums_track.note_on(noteNumber);
            break;
    }   

    // If is recording, will add note to record
    if (drums_track.get_status_recording()) {
        drums_track.on_record(noteNumber);
    }

    else if (guitar_track.get_status_recording()) {
        guitar_track.on_record(noteNumber);
    }

    else if (bass_track.get_status_recording()) {
        bass_track.on_record(noteNumber);
    }

    else if (piano_track.get_status_recording()) {
        piano_track.on_record(noteNumber);
    }
}

// Too lazy to implement noteOff... Else, it might just be a triggerRelease in the Track object...
function noteOff (noteNumber) {
    // console.log('note off', noteNumber);
}

function stop_other_recordings(current_track) {
    all_tracks.forEach(element => {
        if (element !== current_track) {
            element.end_record(false);
        }
    })
}

let nth_measure = 0;
let nth_time = 1;
let nth_loop = 0;


// =================== METRONOME =========================

const track_metro = ["A3", "G3", "G3", "G3"];
const TEMPO = 120;
const delta_t_sec = 60/TEMPO;

const metro_loop = new Tone.Sequence(function(time, note) { 
    update_measure_box(nth_measure); // Display or hide boxes counting the measures
    metro_click.triggerAttackRelease(note, 4, time);
    if(nth_time % 4 == 0) {
        nth_measure = (nth_measure + 1) % 4; // Update the measure number
    }
    nth_time++;
}, track_metro, delta_t_sec);


// ================== MAIN LOOP =========================
const gui_record_all = document.querySelector('#button-start_rec_all');

gui_record_all.addEventListener('click', () => {
    gui_record_all.disabled = true;
    main_loop = new Tone.Loop(function(time) {

        switch(nth_loop) {
            // First 4 bars : only the metronome
            // Second loop : record drums
            case 1 :
                gui_record_drums.click();
                break;
            // Third loop : unrecord drums and record bass
            case 2 :
                gui_record_drums.click();
                gui_record_bass.click();
                break;
            // 4th loop : unrecord bass and record guitar
            case 3 :
                gui_record_bass.click();
                gui_record_guitar.click();
                break;
            // 5th loop ; unrecord guitar and record piano
            case 4 :
                gui_record_guitar.click();
                gui_record_piano.click();
                break;
            // 6th loop : unrecord piano
            case 5 :
                gui_record_piano.click();
                break;
        }
        
        // I dont know if there is another method than stop and restard a Tone.Part()
        metro_loop.stop();
        piano_part.stop();
        guitar_part.stop();
        bass_part.stop();
        drums_part.stop();

        metro_loop.start();
        piano_part.start();
        guitar_part.start();
        bass_part.start();
        drums_part.start();
        nth_loop++;
    }, 4*4*delta_t_sec); // 4 bars of key signature 4/4

    main_loop.start();
    Tone.Transport.start();
});