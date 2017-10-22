function StepGroup(name) {
    const inputPrefix = 'input';
    const bufferPrefix = 'buffer';
    const previewPrefix = 'preview';

    this.currentID = 0;
    this.name = name;
    this.steps = [];

    this.lastStep = function() {
        var index = this.steps.length - 1;
        return (index >= 0)
            ? this.steps[index]
            : null;
    };

    this.generateID = function(prefix) {
        return prefix + "_" + this.currentID.toString();
    };

    this.createNewStep = function(text = '', html = '') {
        this.currentID += 1;
        var id = this.generateID(this.name);

        return new MathjaxInput(id, text, html, this.currentID, 'Enter step text');
    };

    this.addNewStep = function() {
        var newText = '';
        var newHtml = '';

        var lastStep = this.lastStep();
        if(lastStep){
            newText = lastStep.text;
            newHtml = lastStep.html;
        }

        this.steps.push(this.createNewStep(newText, newHtml));
    };

    this.editStep = function(text, number) {
        var index = _.findIndex(this.steps, x => { return x.number === number; });
        this.steps[index].updateText(text);
    };

    this.deleteStep = function(number) {
        var index = _.findIndex(this.steps, x => { return x.number === number; });
        this.steps.splice(index, 1);
    };

    this.initStepsFromList = function(stepsList) {
        this.currentID = 0;
        this.steps = [];

        stepsList.forEach(step => {
            var newStep = this.createNewStep(step.text, '');
            this.steps.push(newStep);
        });
    };

    this.isValid = function() {
        var valid = true;

        this.steps.forEach(step => {
            if(!step.isValid()) {
                valid = false;
            }
        });

        return valid;
    };
}
