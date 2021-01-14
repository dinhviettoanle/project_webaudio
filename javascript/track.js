class Track {
    constructor(data) {
        
        this.name = data.name;
        const samples = data.samples;
        const base_url = data.base_url;
        this.AVAILABLE_NOTES = data.available_notes;
        this.channel = data.channel;


        // =========== SAMPLER ===========
        this.sampler_is_loaded = false;

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
        }).toDestination();


        // ============= RECORD ===============
        this.time_start_record = 0;
        this.notes_track = [];
        this.status_recording = false;


        // ============== GUI ==============
        this.gui_row = document.querySelector(`#row-track_${this.name}`);
        this.gui_row.addEventListener('click', () => {select_row(this.gui_row, this.channel)});

        this.gui_record = document.querySelector(`#button-record_${this.name}`);
        this.gui_record.addEventListener('click', () => {this._start_record()});

        this.gui_play = document.querySelector(`#button-play_${this.name}`);
        this.gui_play.addEventListener('click', () => {this._play_test()});
    }


    // ======== PLAY KEYBOARD ============
    note_on(noteNumber) {
        if (this.sampler_is_loaded && this.AVAILABLE_NOTES.includes(noteNumber)) {
            this.sampler.triggerAttackRelease(Tone.Frequency(noteNumber, "midi").toNote(), 4)
        }
    }



    // ============= RECORD =============

    get_status_recording() {
        return this.status_recording;
    }

    set_status_recording(status) {
        this.status_recording = status;
    }

    _start_record() {
        select_record_button(this.gui_record);
        this.time_start_record = Tone.now();
        console.log(`Recording ${this.name}...`);
        this.notes_track = [];
        this.status_recording = true; // Activate the recording when there is a note ON signal
    }

    on_record(noteNumber) {
        this.notes_track.push({
            "time" : Tone.now() - this.time_start_record,
            "name" : noteNumber
        });
    }
    
    // ============== PLAY ===============
    _play_test() {
        const time_start_play = Tone.now();
        this.notes_track.forEach(note => {
            this.sampler.triggerAttackRelease(Tone.Frequency(note.name, "midi").toNote(), 4, note.time + time_start_play);
        });
    }
}