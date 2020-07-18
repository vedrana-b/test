/**
 * Function initialises onclick event selectors.
 */
const init = () => {
    const submitButtons = document.querySelectorAll('button[name="submit"]');
    for (let button of submitButtons) {
        button.onclick = submitForm;
    }
    const signUpEmail = document.getElementById('js-signup-email');
    const signUpPhone = document.getElementById('js-signup-phone');
    signUpEmail.onclick = showElem;
    signUpPhone.onclick = showElem;
}
init();

/**
 * Function returns currency value in form with name 
 * 
 * @param {string} formName - name of form which can be 'email' or 'phone'
 */
const getSelectedCurrency = (formName) => {
    return document.querySelector(`#${formName}-content select[name="currency"]`).value;
}

/**
 * Function returns email value in form with name
 * 
 * @param {string} formName - name of form which can be 'email' or 'phone'
 */
const getEmail = (formName) => {
    return document.querySelector(`#${formName}-content input[name="email"]`).value;
}

/**
 * Function returs phone number value in form with name
 * 
 * @param {string} formName - name of form which can be 'email' or 'phone'
 */
const getPhonenumber = (formName) => {
    return document.querySelector(`#${formName}-content input[name="phone"]`).value;
}

/**
 * Function returns promo checkbox value in form with name
 * 
 * @param {string} formName - name of form which can be 'email' or 'phone'
 */
const getPromoCheckbox = (formName) => {
    return document.querySelector(`#${formName}-content input[name="promoCheckbox"]`).checked;
}

/**
 * Function returns terms and conditions checkbox value in form with name
 * 
 * @param {string} formName - name of form which can be 'email' or 'phone'
 */
const getTermsCheckbox = (formName) => {
    return document.querySelector(`#${formName}-content input[name="termsCheckbox"]`).checked;
}


/**
 * Function returns a new object if there are validation errors
 * New object has new properities field and text 
 * 
 * @param {object} validationResult - Result from joi validation function
 * @returns {Array} - Array of mapped errors
 */
const getErrors = (validationResult) => {
    const errorDetails = validationResult.error ? validationResult.error.details : [];
    return errorDetails.map(error => {
        return {
            field: error.path[0],
            text: error.message
        }
    });
}

/**
 * Function removes old errors from HTML
 */
const resetErrorMessages = () => {
    errorElem = document.querySelectorAll('span[name="error"]');
    errorElem.forEach(function (element) {
        element.remove();
    });
}

/**
 * Function shows each error in HTML
 * @param {Array} errors 
 * @param {string} formName - name of form which can be 'email' or 'phone'
 */
const showErrors = (errors, formName) => {
    const form = document.querySelector(`#${formName}-content form`);

    errors.forEach(error => {
        const field = form.querySelector(`[name=${error.field}]`);
        const message = document.createElement('span');
        message.classList.add('error');
        message.setAttribute('name', 'error');
        message.innerHTML = error.text;
        field.parentNode.parentNode.insertBefore(message, field.parentNode.nextSibling);
    });
}

/**
 * This function shows spinner in passed section
 * 
 * @param {HTMLElement} section 
 */
const showSpinner = (section) => {
    document.querySelector('div .spinner').style.display = "block";
    section.querySelector('fieldset').classList.add('form__fieldset--opacity');
}

/**
 * Function hides spinner in passed section
 * 
 * @param {HTMLElement} section 
 */
const hideSpinner = (section) => {
    document.querySelector('div .spinner').style.display = "none";
    section.querySelector('fieldset').classList.remove('form__fieldset--opacity');
}

/**
 * Functions shows signup status message depending whether account is created or not
 * 
 * @param {HTMLElement} button 
 * @param {boolean} success - determines the message
 */
const showMessage = (button, success) => {
    if (document.getElementById('signup-message')) {
        document.getElementById('signup-message').remove();
    }
    const messageText = {
        success: [
            'Thank you! Your user registration was successful.',
            'You can login anytime now.'
        ],
        error: [
            'Registration is temporarily unavailable.',
            'Please try again later.'
        ]
    }

    // Create HTML for signup status messages
    const loginMessageContainer = document.createElement('div');
    loginMessageContainer.classList.add(`signup-message--${success ? 'success' : 'error'}`);
    loginMessageContainer.setAttribute('id', 'signup-message');
    const messageHeader = document.createElement('h6');
    const messageParagraph = document.createElement('p');
    const textNode = document.createTextNode(success ? messageText.success[0] : messageText.error[0]);
    const textNode2 = document.createTextNode(success ? messageText.success[1] : messageText.error[1]);
    messageHeader.appendChild(textNode);
    messageParagraph.appendChild(textNode2);
    loginMessageContainer.appendChild(messageHeader);
    loginMessageContainer.appendChild(messageParagraph);
    button.closest('form').appendChild(loginMessageContainer);
}

/**
 * Function validates form fields depending on which form is used
 * Function uses joi hapi library for validation
 * 
 * @param {string} formName name of form which can be 'email' or 'phone'
 * @returns {object} with error and details properties
 */
const validations = (formName) => {
    if (formName === 'email') {
        let user = {
            email: getEmail(formName),
            currency: getSelectedCurrency(formName),
            promoCheckbox: getPromoCheckbox(formName),
            termsCheckbox: getTermsCheckbox(formName)
        }

        const schema = joi.object({
            email: joi.string()
                .min(3)
                .max(30)
                .email({ tlds: { allow: false } })
                .required()
                .messages({
                    'string.base': `Email should be a type of 'text'`,
                    'string.empty': `Email cannot be an empty field`,
                    'string.email': 'Email is not valid',
                    'string.min': `Email should have a minimum length of {#limit}`,
                    'string.max': `Email should have a maximum length of {#limit}`,
                    'any.required': `Email is a required field`
                }),
            currency: joi.string()
                .required()
                .messages({
                    'string.empty': `Please select currency`,
                    'any.required': `Currency is a required field`
                }),
            promoCheckbox: joi.boolean().optional().allow(false),
            termsCheckbox: joi.boolean()
                .valid(true)
                .messages({
                    'any.only': `You must confirm Terms and Conditions`
                })
        }).options({
            abortEarly: false
        });
        return schema.validate(user);

    } else if (formName === 'phone') {
        let user = {
            phone: getPhonenumber(formName),
            currency: getSelectedCurrency(formName),
            promoCheckbox: getPromoCheckbox(formName),
            termsCheckbox: getTermsCheckbox(formName)
        }

        const schema = joi.object({
            phone: joi.string()
                .pattern(new RegExp('^\\+\\d{3}\\s?\\d{2}\\s?\\d{3}\\s?\\d{3,4}$'))
                .required()
                .messages({
                    'string.empty': `Phone number cannot be an empty field`,
                    'any.required': `Phone number is a required field`,
                    'string.pattern.base': `Please enter your phone number in this format +XXX XX XXX XXXX`
                }),
            currency: joi.string()
                .required()
                .messages({
                    'string.empty': `Please select currency`,
                    'any.required': `Currency is a required field`
                }),
            promoCheckbox: joi.boolean().optional().allow(false),
            termsCheckbox: joi.boolean()
                .valid(true)
                .messages({
                    'any.only': `You must confirm Terms and Conditions`
                })
        }).options({
            abortEarly: false
        });
        return schema.validate(user);
    }
}

/**
 * Function resets existing errors in HTML
 * Then shows new errors if there are any
 * Then shows spinner and signup message that can be success or error
 * Chances for success are 50%
 * 
 * @param {event} event - onclick event
 */
function submitForm(event) {
    // Removes old error messages
    resetErrorMessages();

    const button = event.target;
    const section = button.closest('section');
    const formName = section.getAttribute('data-section');
    
    // Validates form
    const validationResult = validations(formName);
    const errors = getErrors(validationResult);

    // Show error messages if there are errors
    if (errors && errors.length) {
        showErrors(errors, formName);
        return;
    }

    // Show loading spinner
    showSpinner(section);

    // Mocking waiting response time (1.5s)
    setTimeout(function () {
        // Hide loading spinner
        hideSpinner(section);

        // Mocking success response from service
        // Chances for success response are 50%
        const success = Math.random() > 0.5;

        // Show message according to service response
        showMessage(button, success);
    }, 1500);
}

/**
 * Function switches forms between email and phone
 *
 * @param {event} event - onclick event
 */
function showElem(event) {
    const selectedSection = event.target.getAttribute('data-select-section');
    // Set active elements
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        if (link.getAttribute('data-select-section') === selectedSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    }

    // Switch sections
    const sections = document.querySelectorAll('#js-signup-form section');
    for (let section of sections) {
        if (section.getAttribute('data-section') === selectedSection) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    }
}


