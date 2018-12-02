var addTeamButton = document.getElementById('add-teams-button');
var hideModalButton = document.getElementById('modal-cancel');
var xModal = document.getElementById('modal-close');
var updateButton = document.getElementById('modal-accept');

addTeamButton.addEventListener("click", function() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var modal = document.getElementById('add-teams-modal');
    var checkboxes = document.getElementsByName('input-team');
    var myTeamsArr = document.getElementsByClassName('my-team');
    var i = 0;
    modalBackdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
    for(i = 0; i < myTeamsArr.length; i++){
        checkboxes.forEach(element => {
            if(element.value === myTeamsArr[i].getAttribute('data-name')){
                element.checked = true;
            }
        });
    }
});

hideModalButton.addEventListener("click", function() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var modal = document.getElementById('add-teams-modal');
    var checkboxes = document.getElementsByName('input-team');
    checkboxes.forEach(element => {
        element.checked = false;
    });
    modalBackdrop.classList.add('hidden');
    modal.classList.add('hidden');
});

xModal.addEventListener("click", function() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var modal = document.getElementById('add-teams-modal');
    var checkboxes = document.getElementsByName('input-team');
    checkboxes.forEach(element => {
        element.checked = false;
    });
    modalBackdrop.classList.add('hidden');
    modal.classList.add('hidden');
});

updateButton.addEventListener("click", function() {
    var myTeams = [];
    var checkboxes = document.getElementsByName('input-team');
    checkboxes.forEach(element => {
        if(element.checked == true){
            myTeams.push(element.value);
        }
    });
    var pushRequest = new XMLHttpRequest();
    pushRequest.open('POST', '/updateMyTeams');
    pushRequest.setRequestHeader('Content-Type', 'application/json');

    pushRequest.send(JSON.stringify(myTeams));

    location.reload(true);

});