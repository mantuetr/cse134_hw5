const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const commentsInput = document.querySelector("#comments");

const errorArea = document.querySelector("#error-area");
const infoArea = document.querySelector("#info-area");
const characterCount = document.querySelector("#character-count");
const errorHistoryInput = document.querySelector("#form-errors");
const maxCharacters = commentsInput.maxLength;
const warningThreshold = 100;

const fields = [nameInput, emailInput, commentsInput];

const form_errors = [];
const editedFields = new Set();
const showErrors = new Set();

function getErrorMessage(field) {
    field.setCustomValidity("");

    const validity = field.validity;

    const fieldNames = {
        name: "Name",
        email: "Email",
        comments: "Message"
    };

    const fieldName = fieldNames[field.id];

    if (validity.valueMissing) {
        return `${fieldName}: This field is required.`;
    }

    if (validity.typeMismatch) {
        return "Email: Please enter a valid email address.";
    }

    if (validity.patternMismatch) {
        return "Email: Please check the email format.";
    }

    if (validity.tooShort) {
        return `${fieldName}: Please enter at least ${field.minLength} characters.`;
    }

    if (validity.tooLong) {
        return `${fieldName}: Please enter no more than ${field.maxLength} characters.`;
    }

    return "";
}


function validateField(field) {
    const message = getErrorMessage(field);

    field.setCustomValidity(message);

    const errorElement = document.querySelector(`#${field.id}-error`);

    if (message && showErrors.has(field.id)) {
        errorElement.textContent = message;
        errorElement.hidden = false;
        field.setAttribute("aria-invalid", "true");
    } else {
        errorElement.textContent = "";
        errorElement.hidden = true;
        field.removeAttribute("aria-invalid");
    }

    return message;
}

fields.forEach((field) => {
    field.addEventListener("input", () => {
        editedFields.add(field.id);
        validateField(field);
        updateErrorArea();
    });

    field.addEventListener("blur", () => {
        if (editedFields.has(field.id)) {
            showErrors.add(field.id);
            validateField(field);
            updateErrorArea();
        }
    });
});

function updateErrorArea() {
    const errorList = document.querySelector("#error-list");

    errorList.replaceChildren();

    fields.forEach((field) => {
        const errorElement = document.querySelector(
            `#${field.id}-error`
        );

        if (!errorElement.hidden) {
            const listItem = document.createElement("li");
            listItem.textContent = errorElement.textContent;
            errorList.appendChild(listItem);
        }
    });

    errorArea.hidden = errorList.children.length === 0;
}

function updateCharacterCount() {
    const remaining = maxCharacters - commentsInput.value.length;

    infoArea.hidden = false;
    infoArea.classList.remove("near-limit", "at-limit");

    if (remaining === 0) {
        characterCount.textContent =
            "0 characters remaining. Maximum length reached!";
        infoArea.classList.add("at-limit");
    } else if (remaining <= warningThreshold) {
        characterCount.textContent =
            `${remaining} characters remaining. You're approaching the limit!`;
        infoArea.classList.add("near-limit");
    } else {
        characterCount.textContent =
            `${remaining} characters remaining.`;
    }
}

commentsInput.addEventListener("input", updateCharacterCount);

updateCharacterCount();

form.noValidate = true;

form.addEventListener("submit", (event) => {
    const errorsThisAttempt = [];

    fields.forEach((field) => {
        showErrors.add(field.id);

        const message = validateField(field);

        if (message) {
            errorsThisAttempt.push({
                field: field.name,
                error: message
            });
        }
    });

    updateErrorArea();

    if (errorsThisAttempt.length > 0) {
        event.preventDefault();

        form_errors.push(...errorsThisAttempt);
        return;
    }

    errorHistoryInput.value = JSON.stringify(form_errors);
});

