(function () {

"use strict";

function setupValidation(form, config) {

    form.addEventListener('submit', function(e) {
        var isValid = validate();
        if(!isValid) {
            e.preventDefault();
        }

    });

    function validate() {
        var messages = form.querySelectorAll('.alert');
        for(var i =0; i < messages.length; i++) {
            messages[i].parentNode.removeChild(messages[i]);
        }
        var isValid = true;
        for(var field in config.fields) {
            var validators = config.fields[field];
            field:for(var validator in validators) {
                switch(validator) {
                    case 'required': 
                        if(!validateRequired(field)) {
                            isValid = false;
                            showValidationMessage(field, validator);
                            break field;
                        }
                        break;
                    case 'pattern': 
                        if(!validatePattern(field)) {
                            isValid = false;
                            showValidationMessage(field, validator);
                            break field;
                        }
                        break;

                }
            }
        }
        return isValid;
    }

    function validateRequired(inputName) {
        return form.querySelector('[name="'+inputName+'"]')
            .value.trim().length > 0;
    }

    function validatePattern(inputName) {
        return form.querySelector('[name="'+inputName+'"]')
            .value.trim().match(config.fields[inputName].pattern);
    }

    function showValidationMessage(inputName, message) {
        var parent = form.querySelector('[name="'+inputName+'"]').parentNode;
        var error = document.createElement('div');
        error.className = 'alert alert-danger';
        error.innerHTML = config.errorMessages[inputName][message] || 'Invalid';
        parent.appendChild(error)
    }
}

var form = document.getElementById('sign-in');
var config = {
    fields: {
        email: {
            required: true,
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        },
        password: {
            required: true,
            pattern: /^[a-zA-Z0-9]$/,
            minLength: 6
        },
        confirmPass: {
            required: true,
            pattern: /^[a-zA-Z0-9]$/,
            minLength: 6,
            equalTo: 'password'
        }
    },
    errorMessages: {
        email: {
            required: 'Field is required',
            pattern: 'Field should be an email'
        },
        password: {
            required: 'Field is required',
            pattern: 'Password should contain only letters and numbers',
            minLength: 'Min length 6 symbols'
        },
        confirmPass: {
            required: 'Field is required',
            pattern: 'Password should contain only letters and numbers',
            minLength: 'Min length 6 symbols',
            equalTo: 'Passwords should match'
        }
    }
};

setupValidation(form, config);

})()
