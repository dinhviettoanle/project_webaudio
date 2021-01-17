const gui_record_piano = document.querySelector('#button-record_piano');
const gui_record_guitar = document.querySelector('#button-record_guitar');
const gui_record_bass = document.querySelector('#button-record_bass');
const gui_record_drums = document.querySelector('#button-record_drums');
const gui_end_record = document.querySelector('#button-end_rec');
const list_records = [gui_record_piano, gui_record_guitar, gui_record_bass, gui_record_drums, gui_end_record];



const gui_row_record_piano = document.querySelector('#row-track_piano');
const gui_row_record_guitar = document.querySelector('#row-track_guitar');
const gui_row_record_bass = document.querySelector('#row-track_bass');
const gui_row_record_drums = document.querySelector('#row-track_drums');
const list_rows = [gui_row_record_piano, gui_row_record_guitar, gui_row_record_bass, gui_row_record_drums];

let which_selected = 0; // Which instrument is selected and can be played

let number_recordings = 0;

function get_number_recordings() {
    return number_recordings;
}

function add_new_recording() {
    number_recordings = number_recordings + 1;
}


function select_row(chosen, value_selected) {
    list_rows.forEach(element => {
        if (element === chosen) {
            element.style = "background-color:wheat;";
        }
        else {
            element.style = "background-color:honeydew;";
        }   
    });
    which_selected = value_selected;
}



function select_record_button(chosen) {
    list_records.forEach(element => {
        if (element === chosen) {
            element.className = "btn btn-danger btn-block";
        }
        else {
            element.className = "btn btn-outline-danger btn-block";
        }   
    });
}


// SLIDERS

$(function() {
    $("#slider_metro").slider({
        value: 50,
        slide: function(e, ui){
            gain_metro.gain.value = ui.value/100;
        }
    });
});

$(function() {
    $("#slider_piano").slider({
        value: 50,
        slide: function(e, ui){
            piano_track.set_gain(ui.value/100);
        }
    });
});

$(function() {
    $("#slider_guitar").slider({
        value: 75,
        slide: function(e, ui){
            guitar_track.set_gain(ui.value/100);
        }
    });
});

$(function() {
    $("#slider_bass").slider({
        value: 75,
        slide: function(e, ui){
            bass_track.set_gain(ui.value/100);
        }
    });
});

$(function() {
    $("#slider_drums").slider({
        value: 100,
        slide: function(e, ui){
            drums_track.set_gain(ui.value/100);
        }
    });
});


function update_measure_box(nth_measure){
    if(nth_measure < 1) {
        $("#box_meas2").hide();
    }
    else {
        $("#box_meas2").show();
    }

    if(nth_measure < 2) {
        $("#box_meas3").hide();
    }
    else {
        $("#box_meas3").show();
    }

    if(nth_measure < 3) {
        $("#box_meas4").hide();
    }
    else {
        $("#box_meas4").show();
    }
}



gui_end_record.addEventListener('click', function(){
    gui_end_record.className = "btn btn-danger btn-block";

    piano_track.end_record();
    guitar_track.end_record();
    bass_track.end_record();
    drums_track.end_record();

    console.log("All recordings have been ended !");
});


