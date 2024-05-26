document.addEventListener('DOMContentLoaded', function () {
    addEventListeners();
});

function addEventListeners(){

    allergyCardListeners();
};

function allergyCardListeners() {
    const checkboxes = document.querySelectorAll(".allergy_checkbox");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const card = this.closest('.allergy_card');
            console.log(this.checked);
            card.classList.toggle('selected');
        });
    });
}