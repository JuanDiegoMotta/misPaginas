document.addEventListener('DOMContentLoaded', function () {
    addEventListeners();
});

function addEventListeners() {

    allergyCardListeners();
    nextButtonAccountListener();
    nextButtonProfileListener();
    nextButtonDietListener();
    showButtonListener();
    nextButtonCaloriesListener()
};



function allergyCardListeners() {
    const checkboxes = document.querySelectorAll(".allergy_checkbox");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const card = this.closest('.allergy_card');
            console.log(this.checked);
            card.classList.toggle('selected');
        });
    });
}

function nextButtonAccountListener() {
    const nextButton = document.getElementById('next_button_account');
    nextButton.addEventListener('click', function (event) {
        event.preventDefault();
        const formId = this.closest('.form_container').id;
        console.log("Botón next pulsado del formulario: ", formId)
        validateAccountForm(formId);
    })
}

function validateAccountForm(formId) {
    const email = document.getElementById('email_account').value.trim();
    const username = document.getElementById('username_account').value.trim();
    const password = document.getElementById('password_account').value.trim();
    const confirmPassword = document.getElementById('confirm_password_account').value.trim();

    let isValid = true;

    // Clear previous error messages
    clearErrors();

    //Email validation
    if (!validateEmail(email)) {
        showError('email_account', 'Please enter a valid email adress.');
        isValid = false;
    }

    // Username validation
    if (username === '') {
        showError('username_account', 'Username cannot be empty.');
        isValid = false;
    }

    // Password validation
    if (password.length < 8) {
        showError('password_account', 'Password must be at least 8 characters long.');
        isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        showError('confirm_password_account', 'Passwords do not match.');
        isValid = false;
    }

    // If form is valid, proceed to the next step (e.g., server validation)
    if (isValid) {
        serverValidationAccount(formId);
    }

}

function serverValidationAccount(formId) {
    console.log("Entra a serverValidationAccount")
    let data = { formId: formId };
    data.email = document.getElementById('email_account').value.trim();
    data.username = document.getElementById('username_account').value.trim();
    data.password = document.getElementById('password_account').value.trim();
    console.log("Data:", data);
    fetch('../php/proceso_registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Navegar al siguiente formulario
                console.log('User created successfully');
                navigateToNextForm(formId);
            } else {
                // Mostrar mensajes de error específicos
                if (data.errorField === 'email') {
                    showError('email_account', data.message);
                } else if (data.errorField === 'username') {
                    showError('username_account', data.message);
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function nextButtonProfileListener() {
    const nextButton = document.getElementById('next_button_profile');
    nextButton.addEventListener('click', function (event) {
        event.preventDefault();
        const formId = this.closest('.form_container').id;
        validateProfileForm(formId);
    });
}

function validateProfileForm(formId) {
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.querySelector('input[name="gender"]:checked');

    let isValid = true;

    // Clear previous error messages
    clearErrors();

    // Name validation
    if (name === '') {
        showError('name', 'Name cannot be empty.');
        isValid = false;
    }

    // Surname validation
    if (surname === '') {
        showError('surname', 'Surname cannot be empty.');
        isValid = false;
    }

    // Birthdate validation
    if (birthdate === '') {
        showError('birthdate', 'Birthdate cannot be empty.');
        isValid = false;
    } else {
        const birthdateObj = new Date(birthdate);
        const currentDate = new Date();
        const minDate = new Date('1900-01-01');
        if (birthdateObj > currentDate || birthdateObj < minDate) {
            showError('birthdate', 'Please enter a valid birthdate.');
            isValid = false;
        }
    }

    // Gender validation
    if (!gender) {
        showError('gender', 'Gender must be selected.');
        isValid = false;
    }

    // If form is valid, proceed to the next step (e.g., server validation)
    if (isValid) {
        console.log("Proceeding with serverValidationProfile()...");
        serverValidationProfile(formId, name, surname, birthdate, gender.value);
    }
}

function serverValidationProfile(formId, name, surname, birthdate, gender) {
    let data = {
        formId: formId,
        name: name,
        surname: surname,
        birthdate: birthdate,
        gender: gender
    };
    console.log(data);
    fetch('../php/proceso_registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('User info successfully updated');

                // Navegar al siguiente formulario
                navigateToNextForm(formId);
            } else {
                // Mostrar mensajes de error
                showError('profile_form', data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function nextButtonDietListener() {
    const nextButton = document.getElementById('next_button_diet');
    nextButton.addEventListener('click', function (event) {
        event.preventDefault();
        const formId = this.closest('.form_container').id;
        validateDietForm(formId);
    });
}

function validateDietForm(formId) {
    const diet = document.getElementById('diet_select').value;
    const allergies = Array.from(document.querySelectorAll('input[name="allergies"]:checked')).map(el => el.value);
    const goal = document.querySelector('input[name="goal"]:checked');
    console.log(allergies);

    let isValid = true;

    // Clear previous error messages
    clearErrors();

    // Diet validation
    if (diet === '' || diet === null) {
        showError('diet_select', 'Please select a diet.');
        isValid = false;
    }

    // Goal validation
    if (!goal) {
        showError('goal', 'Please select a goal.');
        isValid = false;
    }

    // If form is valid, proceed to the next step (e.g., server validation)
    if (isValid) {
        console.log('Proceeding with serverValidationDiet...');
        serverValidationDiet(formId, diet, allergies, goal.value);
    }
}

function serverValidationDiet(formId, diet, allergies, goal) {
    let data = {
        formId: formId,
        diet: diet,
        allergies: allergies,
        goal: goal

    };

    fetch('../php/proceso_registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('User diet successfully updated');
                //Move to next form
                navigateToNextForm(formId);
            } else {
                showError('diet_form', data.message);
            }
        })
}

function showButtonListener() {
    const showButton = document.getElementById('calculate_button');
    showButton.addEventListener('click', function (event) {
        console.log('Se ha clicado showButton');
        event.preventDefault();
        getInfoAndCalculateCalories();
    });
}

function getInfoAndCalculateCalories() {
    console.log('Extrayendo info para el cálculo de las calorías del servidor');
    fetch('../php/proceso_registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formId: 'get_user_info' })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Info recuperada:', data.age, data.gender);
                calculateEstimatedCalories(data.age, data.gender);
            } else {
                console.log('Error al extraer info extra para el cálculo de calorías.')
                showError('section_calculate_calories', 'Error fetching additional information.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function calculateEstimatedCalories(age, gender) {
    console.log('Entra en calculateEstimatedCalories');
    const height = parseFloat(document.getElementById('height').value.trim());
    const weight = parseFloat(document.getElementById('weight').value.trim());
    const activity = parseFloat(document.getElementById('activity').value);
    console.log('Datos:', height, weight, activity);

    if (validateCaloriesCalculation(height, weight, activity)) {
        console.log('calculating bmr');
        // Fórmula simple para estimar calorías, puede ser ajustada según tus necesidades
        let bmr;
        if (gender === 'M') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        console.log('Estimated calories befor activity: ', bmr);
        const estimatedCalories = bmr * (1.2 + activity * 0.175);
        console.log('Estimated calories: ', estimatedCalories);
        document.getElementById('calories').value = estimatedCalories.toFixed(2);
    } else {
        // Mostrar error si algún campo no es válido
        showError('section_estimated_calories', 'Please enter valid values to calculate calories.');
    }
}

function validateCaloriesCalculation(height, weight, activity) {
    let isValid = true;
    clearErrors();
    // Height validation
    if (height === '' || isNaN(height) || height <= 0) {
        console.log('Invalid height');
        showError('height', 'Please enter a valid height.');
        isValid = false;
    }

    // Weight validation
    if (weight === '' || isNaN(weight) || weight <= 0) {
        console.log('Invalid weight');
        showError('weight', 'Please enter a valid weight.');
        isValid = false;
    }

    // Activity validation
    if (activity === '' || isNaN(activity)) {
        console.log('Invalid activity');
        showError('activity', 'Please select an activity level.');
        isValid = false;
    }
    return isValid;
}

function nextButtonCaloriesListener() {
    const nextButton = document.getElementById('next_button_calories');
    nextButton.addEventListener('click', function (event) {
        event.preventDefault();
        const formId = this.closest('.form_container').id;
        console.log("Botón next pulsado del formulario: ", formId);
        validateCaloriesForm(formId);
    });
}

function validateCaloriesForm(formId){
    const height = document.getElementById('height').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const activity = document.getElementById('activity').value;
    const estimatedCalories = document.getElementById('calories').value.trim();

    let isValid = true;

    // Clear previous error messages
    clearErrors();

    // Height validation
    if (height === '' || isNaN(height) || height <= 0) {
        showError('height', 'Please enter a valid height.');
        isValid = false;
    }

    // Weight validation
    if (weight === '' || isNaN(weight) || weight <= 0) {
        showError('weight', 'Please enter a valid weight.');
        isValid = false;
    }

    // Activity validation
    if (activity === '' || isNaN(activity)) {
        showError('activity', 'Please select an activity level.');
        isValid = false;
    }

    // Estimated Calories validation
    if (estimatedCalories === '' || isNaN(estimatedCalories) || estimatedCalories <= 0) {
        showError('calories', 'Please calculate estimated calories.');
        isValid = false;
    }

    // If form is valid, proceed to the next step (e.g., server validation)
    if (isValid) {
        console.log('Proceeding with serverValidationCalories...');
        serverValidationCalories(formId, height, weight, activity, estimatedCalories);
    }
}

function serverValidationCalories(formId, height, weight, activity, estimatedCalories) {
    let data = {
        formId: formId,
        height: height,
        weight: weight,
        activity: activity,
        estimated_calories: estimatedCalories
    };
    console.log(data);

    fetch('../php/proceso_registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Calories information successfully updated');
            // Finalizar el proceso de registro
            navigateToNextForm(formId);
        } else {
            showError('calories_form', data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error_message');
    console.log("Errores:", errorMessages);
    errorMessages.forEach(error => error.remove());
}

function showError(inputId, message) {
    console.log('Entra en show error');
    let inputField;
    let errorMessage;
    switch (inputId) {
        case 'gender':
            inputField = document.querySelector('.radio');
            errorMessage = document.createElement('div');
            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.appendChild(errorMessage);
            break;

        case 'goal':
            inputField = document.querySelector('.radio_goal');
            errorMessage = document.createElement('div');
            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.appendChild(errorMessage);
            break;
        case 'profile_form':
            inputField = document.querySelector('#profile_form');
            errorMessage = document.createElement('div');
            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.appendChild(errorMessage);
        case 'diet_form':
            inputField = document.querySelector('#diet_form');
            errorMessage = document.createElement('div');
            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.appendChild(errorMessage);
            break;
        case 'section_calculate_calories':
            inputField = document.querySelector('#section_calculate_form');
            errorMessage = document.createElement('div');
            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.appendChild(errorMessage);
            break;
        case 'section_estimated_calories':
            inputField = document.querySelector('#section_estimated_calories');
            errorMessage = document.createElement('div');
            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.appendChild(errorMessage);
            break;
        
        case 'calories_form':
            inputField = document.querySelector('#calories_form');
            errorMessage = document.createElement('div');
            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.appendChild(errorMessage);
            break;
        default:
            inputField = document.getElementById(inputId);
            errorMessage = document.createElement('div');

            errorMessage.className = 'error_message';
            errorMessage.innerText = message;
            inputField.parentNode.appendChild(errorMessage);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}


function navigateToNextForm(formId) {
    const currentForm = document.getElementById(formId);
    currentForm.classList.remove('visible');

    let nextFormId;
    switch (formId) {
        case 'account_form':
            nextFormId = 'profile_form';
            break;
        case 'profile_form':
            nextFormId = 'diet_form';
            break;
        case 'diet_form':
            nextFormId = 'calories_form';
            break;
        case 'calories_form':
            nextFormId = null; // No hay formulario siguiente, finalizar el proceso
            console.log('Registration process completed.');
            // Aquí puedes redirigir al usuario a una página de confirmación o mostrar un mensaje de éxito
            alert('Registration process completed successfully!');
            break;
    }

    if (nextFormId) {
        const nextForm = document.getElementById(nextFormId);
        if (nextForm) {
            nextForm.classList.add('visible');
            changeProgressBar(nextForm);
        }
    }
}
function changeProgressBar(form){
    let last_icon;
    let last_text;
    let icon;
    let text;
    switch(form){
        case 'profile_form':
            icon = document.querySelector('#icon_account');
            text = document.querySelector('#icon_account_text');
            icon = document.querySelector('#icon_profile');
            text = document.querySelector('#icon_profile_text');
            break;
        case 'diet_form':
            last_icon = document.querySelector('#icon_profile');
            last_text = document.querySelector('#icon_profile_text');
            icon = document.querySelector('#icon_diet');
            text = document.querySelector('#icon_diet_text');
            break;
        case 'calories_form':
            last_icon = document.querySelector('#icon_diet');
            last_text = document.querySelector('#icon_diet_text');
            icon = document.querySelector('#icon_calories');
            text = document.querySelector('#icon_calories_text');
            break;
    }
    if(icon && text && last_icon && last_text){
        last_icon.classList.remove("current_icon");
        last_text.clasList.remove("current_text");
        icon.classList.add("current_icon");
        text.classList.add("current_text");
    }
}