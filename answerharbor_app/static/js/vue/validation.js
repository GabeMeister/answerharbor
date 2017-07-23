VeeValidate.Validator.extend('required_question', {
    getMessage: field => 'Please input a question',
    validate: value => {
        return false;
        if(!value){
            return false;
        }

        return true;
    }
});

var ValidationConfig = function() {
    const StepInputValidation = {
        required: 'Please enter some text for this step'
    };

    const QuestionInputValidation = {
        required: 'Please enter a question'
    };

    var errorMessages = {
        en: {
            custom: {}
        }
    };

    this.init = function() {
        for(var i = 1; i < 1000; i++) {
            this.addStepErrorMessage('step_input_'+i);
        }
    };

    this.customErrorMessages = function() {
        return errorMessages;
    };

    this.addStepErrorMessage = function(inputName) {
        errorMessages.en.custom[inputName] = StepInputValidation;
    };

    this.addQuestionErrorMessage = function(inputName) {
        errorMessages.en.custom[inputName] = QuestionInputValidation;
    };

    this.deleteErrorMessage = function(inputName) {
        delete errorMessages.en.custom[inputName];
    };

};

var Validator = new ValidationConfig();
Validator.init();
