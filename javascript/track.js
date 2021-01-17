/*
* Instrument Object that handles some GUI and the recordings
*/

class Track {
    // ***************** CONSTRUCTEUR ************************
    // *******************************************************
    constructor(data) {
        
        this.name = data.name; // Name of the instrument (also in the HTML's ids)
        const samples = data.samples;
        const base_url = data.base_url;
        this.AVAILABLE_NOTES = data.available_notes;
        this.channel = data.channel; // To know which instrument is selected and must play a sound
        this.gain = data.gain;


        // =========== SAMPLER ===========
        this.sampler_is_loaded = false;

        // ** Gain **
        this.gain_node = new Tone.Gain(this.gain/100).toDestination();

        this.sampler = new Tone.Sampler({
            urls: samples,
            release: 1,
            baseUrl: base_url,
            onload: () => {
                console.log(`${this.name} sampler set !`);
                const gui_status = document.querySelector(`#status_${this.name}`);
                gui_status.innerHTML = '<i class="fa fa-check-circle fa-2x"></i>';
                this.sampler_is_loaded = true;
            }
        }).connect(this.gain_node);


        // ============= RECORDING ===============
        this.time_start_record = 0;
        this.notes_track = []; // list of {time, note, velocity}
        this.status_recording = false;


        // ============== GUI ==============
        this.gui_row = document.querySelector(`#row-track_${this.name}`);
        this.gui_row.addEventListener('click', () => {select_row(this.gui_row, this.channel)});

        this.gui_record = document.querySelector(`#button-record_${this.name}`);
        this.gui_record.addEventListener('click', () => {
            if (!this.status_recording) {
                this._start_record();
            }
            else {
                this.end_record(true);
            }
        });
    }

    // ***************** METHODES ************************
    // ***************************************************

    // ======== PLAY KEYBOARD ============
    // When a key is pressed on the keyboard (coming from midi_handler/noteOn)
    note_on(noteNumber) {
        if (this.sampler_is_loaded && this.AVAILABLE_NOTES.includes(noteNumber)) {
            this.sampler.triggerAttackRelease(Tone.Frequency(noteNumber, "midi").toNote(), 4)
        }
    }

    // When the volume is modified (coming from gui/jquery_function)
    set_gain(new_gain) {
        this.gain_node.gain.value = new_gain;
    }



    // ============= RECORDING =============

    get_status_recording() {
        return this.status_recording;
    }

    set_status_recording(status) {
        this.status_recording = status;
    }

    _start_record() {
        select_record_button(this.gui_record); // On the GUI, select the correct button
        stop_other_recordings(this); // Stop all the recordings except this

        // Start recording
        this.time_start_record = Tone.now();
        console.log(`Recording ${this.name}...`);
        this.notes_track = [];
        this.status_recording = true; // Activate the recording boolean when there is a note ON signal (cf. midi_handler/noteOn)
    }

    // What to do when it is currently recording (coming from midi_handler/noteOn)
    on_record(noteNumber) {
        this.notes_track.push({
            "time" : Tone.now() - this.time_start_record,
            "note" : noteNumber,
            "velocity" : 1,
        });
    }

    // End recording
    end_record(new_record) {
        this.gui_record.className = "btn btn-outline-danger btn-block"; // set the button to outline instead of plain
        this.set_status_recording(false);

        if (this.notes_track.length > 0) {
            $(`#ensemble_${this.name}`).prop('checked', true).change(); // change the gui checkbox
            if (new_record) {
                this.update_part(); // Make the part to add it to the main loop
            }
        }
    }

    // =============== PART ==============
    // Initialize a Tone.Part to be played in the main loop
    create_part() {
        this.part = new Tone.Part(((time, value) => {
            this.sampler.triggerAttackRelease(Tone.Frequency(value, "midi").toNote(), 4, time);
        }), this.notes_track); // notes_track is currently empty
        return this.part;
    }

    // Add all the notes played to the Tone.Part after a recording
    update_part(){
        console.log(`${this.name} part updated`);
        this.notes_track.forEach(value => {
            this.part.add(value.time, value.note);
        });
    }
}