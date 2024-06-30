/**
 * 
 * Lumify Contact Form SDK
 * Author: Lumify Labs
 * Website: lumifylabs.com
 * Version: 0.1
 * 
 * @param form The target form element
 * @param endpoint The endpoint for the contact form
 * @param options Override SDK options (optional)
 * 
 */
class LumifyContactFormSdk {

    defaultOptions = {
        formMessageClass: 'lumify-form-message',
        fieldErrorClass: 'lumify-field-error'
    }

    constructor(form, endpoint, options = {}) {
        this.form = form;
        this.endpoint = endpoint;
        this.options = {...this.defaultOptions, ...options};
    }

    errorData = {};

    /**
     * Submits contact form
     * 
     * @returns Promise<Response>
     * @throws Error
     */
    async submitForm() {
        if (!this.endpoint) {
            throw new Error('Configuration error: Please provide a valid API endpoint.')
        }

        const formData = this.getFormData();

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                this.errorData = await response.json();

                if (this.errorData.errors) {

                    throw new Error('Check the form for validation errors.');

                } else {

                    throw new Error(response.statusText);
                }
            }

            return await response.json();

        } catch (error) {

            throw new Error(error.message);
        }
    }

    /**
     * Display a success or error message on the form
     * 
     * @param {string} message The message to show on the form
     * @param state Defaults to 'success' (optional)
     */
    showFormMessage(message, state = 'success') {
        this.clearFormMessage();
        const formMessageElement = this.form.querySelector(`.${this.options.formMessageClass}`);
        if (formMessageElement) {
            
            formMessageElement.innerText = message;

            formMessageElement.classList.add(`${this.options.formMessageClass}-${state}`);
        }
    }

    /**
     * Clear the form message
     * 
     * @returns void
     */
    clearFormMessage() {
        const formMessageElements = this.form.querySelectorAll(`.${this.options.formMessageClass}`);
        formMessageElements.forEach(element => {
            element.classList.remove(`${this.options.formMessageClass}-success`);
            element.classList.remove(`${this.options.formMessageClass}-error`);

            element.innerText = '';
        });
    }

    /**
     * Show errors under each field
     * 
     * @param {Object} errors Key-value pairs of errors
     * @returns void
     */
    showFieldErrors(errors) {
        this.clearFieldErrors(this.form);
        for (let field in errors) {
            const errorElement = this.form.querySelector(`.${this.options.fieldErrorClass}.${this.options.fieldErrorClass}-${field.replace('.', '-')}`);
            if (errorElement) {
                errorElement.innerText = errors[field].join(', ');
            }
        }
    }

    /**
     * Clears field errors
     * 
     * @returns void
     */
    clearFieldErrors() {
        this.errorData = {};
        const errorElements = this.form.querySelectorAll(`.${this.options.fieldErrorClass}`);
        errorElements.forEach(element => {
            element.innerText = '';
        });
    }

    /**
     * Collect the values from the form data
     * 
     * @returns void
     */
    getFormData() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            formData[input.name] = input.value;
        });

        return formData;
    }

    /**
     * Reset form values, clear form message, and clear any errors
     * 
     * @returns void
     */
    resetForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.value = '';
        });

        this.clearFormMessage()
        this.clearFieldErrors()
    }
}
