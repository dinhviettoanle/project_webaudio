const TRACK_1 = 1;
const TRACK_10 = 10;


const gui_record_piano = document.querySelector('#button-record_piano');
const gui_record_drums = document.querySelector('#button-record_drums');
const list_records = [gui_record_piano, gui_record_drums];

const gui_end_record = document.querySelector('#button-end_rec');

const gui_row_record_piano = document.querySelector('#row-track_piano');
const gui_row_record_drums = document.querySelector('#row-track_drums');
const list_rows = [gui_row_record_piano, gui_row_record_drums];

let which_selected = 0; // Which instrument is selected and can be played



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


// ************** TRACK 10 *********************
// ********************************************

let volume_10 = 1;


$(function() {
    $("#slider_drums").slider({
        value: 100,
        slide: function(e, ui){
            volume_10 = ui.value/100;
        }
    });
});





gui_end_record.addEventListener('click', function(){
    gui_end_record.className = "btn btn-danger btn-block";

    gui_record_piano.className = "btn btn-outline-danger btn-block";
    gui_record_drums.className = "btn btn-outline-danger btn-block";

    drums_track.set_status_recording(false);
    piano_track.set_status_recording(false);


    console.log("All recordings have been ended !");
});


