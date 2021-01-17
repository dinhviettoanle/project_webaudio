class Track {
    constructor(data) {
        
        this.name = data.name;
        const samples = data.samples;
        const base_url = data.base_url;
        this.AVAILABLE_NOTES = data.available_notes;
        this.channel = data.channel;
        this.gain = data.gain


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


        // ============= RECORD ===============
        this.time_start_record = 0;
        this.notes_track = [];
        this.status_recording = false;

        this.looping = false;


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


    // ======== PLAY KEYBOARD ============
    note_on(noteNumber) {
        if (this.sampler_is_loaded && this.AVAILABLE_NOTES.includes(noteNumber)) {
            this.sampler.triggerAttackRelease(Tone.Frequency(noteNumber, "midi").toNote(), 4)
        }
    }

    set_gain(new_gain) {
        this.gain_node.gain.value = new_gain;
    }



    // ============= RECORD =============

    get_status_recording() {
        return this.status_recording;
    }

    set_status_recording(status) {
        this.status_recording = status;
    }

    _start_record() {
        select_record_button(this.gui_record); // On the GUI, select the correct button
        stop_other_recordings(this);

        // Start recording
        this.time_start_record = Tone.now();
        console.log(`Recording ${this.name}...`);
        this.notes_track = [];
        this.status_recording = true; // Activate the recording when there is a note ON signal
    }

    on_record(noteNumber) {
        this.notes_track.push({
            "time" : Tone.now() - this.time_start_record,
            "note" : noteNumber,
            "velocity" : 1,
        });
    }

    end_record(new_record) {
        this.gui_record.className = "btn btn-outline-danger btn-block";
        this.set_status_recording(false);

        if (this.notes_track.length > 0) {
            $(`#ensemble_${this.name}`).prop('checked', true).change();
            if (new_record) {
                this.update_part();
            }
        }
    }

    // =============== PART ==============
    create_part() {
        this.part = new Tone.Part(((time, value) => {

            this.sampler.triggerAttackRelease(Tone.Frequency(value, "midi").toNote(), 4, time);
        }), this.notes_track);
        return this.part;
    }

    update_part(){
        console.log(`${this.name} part updated`);
        this.notes_track.forEach(value => {
            this.part.add(value.time, value.note);
        });
    }
}