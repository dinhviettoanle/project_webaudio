


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
            note_on_synthesizer(noteNumber);
            break;
        case 10 :
            note_on_drums(noteNumber);
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

// 5. Create Web Audio Graph
function playSound (buffer, gain) {
    // creates a buffer audio source
    let source = context.createBufferSource();
    let gainNode = context.createGain();
    gainNode.gain.value = gain;
    // tell the source which sound to play
    source.buffer = buffer;
    // connect to output
    // source.connect(context.destination);
    source.connect(gainNode);
    gainNode.connect(context.destination);
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
