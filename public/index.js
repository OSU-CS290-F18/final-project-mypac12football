var addTeamButton = document.getElementById('add-teams-button');
var hideModalButton = document.getElementById('modal-cancel');
var xModal = document.getElementById('modal-close');
var postButton = document.getElementById('modal-accept');

addTeamButton.addEventListener("click", function() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var modal = document.getElementById('add-teams-modal');
    var checkboxes = document.getElementsByName('input-team');
    modalBackdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
});

hideModalButton.addEventListener("click", function() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var modal = document.getElementById('add-teams-modal');
    modalBackdrop.classList.add('hidden');
    modal.classList.add('hidden');
});

xModal.addEventListener("click", function() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var modal = document.getElementById('add-teams-modal');
    modalBackdrop.classList.add('hidden');
    modal.classList.add('hidden');
});