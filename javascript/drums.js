/**
 * SOUND FOR DRUMS
 */



// 3. Midi callback is called if Midi is accessible
function onMIDIInit (midi) {
    console.log('MIDI ready!');

    let haveAtLeastOneDevice = false;
    let inputs = midi.inputs.values();

    // assign Midi Event Handler for all midi Inputs (for example)
    for (let input of inputs) {
        console.log(input.name, "connected "); // id : new one is created on machine reboot or on new connection
        input.onmidimessage = midiMessageEventHandler;
        haveAtLeastOneDevice = true;
    }
    if (!haveAtLeastOneDevice) { console.log("No MIDI input devices present. You're gonna have a bad time."); }
}

// Reject Midi
function onMIDIReject (err) {
    console.log(`The MIDI system failed to start.    You're gonna have a bad time. ${err}`);
}

// 4. Event handler which receive all Midi Messages
function midiMessageEventHandler (event) {
    // 1 message MIDI = 1 byte = 1 octect = 8bits
    // [Status (message type + channel), Data 1 (note), Data 2 (velocity)]
    let str = 'MIDI message received [' + event.data.length + ' bytes]: ';
    for (let i = 0; i < event.data.length; i++) {
        str += event.data[i] + ' ';
    }
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
    const Cbase = 36; // MIDI Note as the root C

    switch (noteNumber) {
        case Cbase:
            playSound(bufferLoader.bufferList[0]); // Kick
            break;
        case Cbase+4:
            playSound(bufferLoader.bufferList[1]); // Snare
            break;
        case Cbase+7:
            playSound(bufferLoader.bufferList[2]); // Tom 1
            break;
        case Cbase+8:
            playSound(bufferLoader.bufferList[3]); // Hihat Close
            break;
        case Cbase+9:
            playSound(bufferLoader.bufferList[4]); // Tom 2
            break;
        case Cbase+10:
            playSound(bufferLoader.bufferList[5]); // Hihat Open
            break;
        case Cbase+11:
            playSound(bufferLoader.bufferList[6]); // Tom 3
            break;
        case Cbase+13:
            playSound(bufferLoader.bufferList[7]); // Crash
            break;
    }

    if (is_recording_drums) {
        drums_track.push({
            "time" : context.currentTime - time_start_drums,
            "note" : noteNumber
        });
    }
}

function noteOff (noteNumber) {
    // console.log('note off', noteNumber);
}

function finishedLoading (bufferList) {
    console.log('Buffer loaded !');
}

// 5. Create Web Audio Graph
function playSound (buffer) {
    // creates a buffer audio source
    let source = context.createBufferSource();
    // tell the source which sound to play
    source.buffer = buffer;
    // connect to output
    source.connect(context.destination)
    // play the source now
    source.start(0);
}

class BufferLoader {
    context;
    urlList;
    onload;
    bufferList = [];
    loadCount = 0;
  
    constructor(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
    }
  
    loadBuffer(url, index) {
        // Load buffer asynchronously
        let loader = this; // set loader
        let request = new XMLHttpRequest(); // create asynchronous request
        request.open('GET', url, true); // init request
        request.responseType = 'arraybuffer'; // type of response: arraybuffer
  
        // success transaction = 200 from server
        request.onload = function () {
            // Asynchronously decode the audio file data contained in ArrayBuffer in request.response
            // baseAudioContext.decodeAudioData(ArrayBuffer, successCallback, errorCallback);
            loader.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        console.log('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount === loader.urlList.length) { loader.onload(loader.bufferList); }
                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };
  
        request.onerror = function () {
            console.log('BufferLoader: XHR error');
        };

        // send request to server
        request.send();
    };
  
    load() {
        for (let i = 0; i < this.urlList.length; ++i) { this.loadBuffer(this.urlList[i], i); }
    };
  
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