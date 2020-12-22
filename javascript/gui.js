const record1 = document.querySelector('#button-record1');
const record_drums = document.querySelector('#button-record_drums');
const end_record = document.querySelector('#button-end_rec');

record1.addEventListener('click', function(){
    record1.className = "btn btn-danger btn-block";

    record_drums.className = "btn btn-outline-danger btn-block";
    end_record.className = "btn btn-outline-danger btn-block";
});


record_drums.addEventListener('click', function(){
    record_drums.className = "btn btn-danger btn-block";

    record1.className = "btn btn-outline-danger btn-block";
    end_record.className = "btn btn-outline-danger btn-block";
});


end_record.addEventListener('click', function(){
    end_record.className = "btn btn-danger btn-block";

    record1.className = "btn btn-outline-danger btn-block";
    record_drums.className = "btn btn-outline-danger btn-block";
});


