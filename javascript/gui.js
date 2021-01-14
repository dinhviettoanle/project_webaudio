const TRACK_1 = 1;
const TRACK_10 = 10;


const record1 = document.querySelector('#button-record1');
const record_drums = document.querySelector('#button-record_drums');
const end_record = document.querySelector('#button-end_rec');

const row_record1 = document.querySelector('#row-track_1');
const row_record10 = document.querySelector('#row-track_10');
const list_rows = [row_record1, row_record10];

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

// ************** TRACK 10 *********************
// ********************************************

let volume_10 = 1;

row_record10.addEventListener('click', function(){ select_row(row_record10, 10); });

// -------------- BUTTON RECORD ---------------
function change_gui_record_drums(){
    select_row(row_record10, 10);
    record_drums.className = "btn btn-danger btn-block";

    record1.className = "btn btn-outline-danger btn-block";
    end_record.className = "btn btn-outline-danger btn-block";
}

$(function() {
    $("#slider_drums").slider({
        value: 100,
        slide: function(e, ui){
            volume_10 = ui.value/100;
        }
    });
});





end_record.addEventListener('click', function(){
    end_record.className = "btn btn-danger btn-block";

    record1.className = "btn btn-outline-danger btn-block";
    record_drums.className = "btn btn-outline-danger btn-block";

    is_recording_drums = false;


    console.log("All recordings have been ended !");
});


