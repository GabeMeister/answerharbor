function MathjaxInput(inputNameID, bufferID, previewID, text, html, number) {
    this.inputNameID = inputNameID;
    this.bufferID = bufferID;
    this.previewID = previewID;
    this.text = text;
    this.html = html;
    this.number = number;
    this.oldText = '';

    this.recordOldText = function() {
        this.oldText = this.text;
    }
}

function StepGroup(name) {
    const inputPrefix = 'input';
    const bufferPrefix = 'buffer';
    const previewPrefix = 'preview';

    var self = this;

    this.currentID = 0;
    this.name = name;
    this.steps = [];

    this.lastStep = function() {
        return this.steps[this.steps.length - 1];
    };

    this.generateID = function(prefix) {
        return prefix + "_" + this.currentID.toString();
    }

    this.createNewStep = function(text = '', html = '', number = 0) {
        var newInputNameID = this.generateID(this.name + "_" + inputPrefix);
        var newBufferID = this.generateID(this.name + "_" + bufferPrefix);
        var newPreviewID = this.generateID(this.name + "_" + previewPrefix);
        var newText = text;
        var newHtml = html;
        var newNumber = number;

        return new MathjaxInput(newInputNameID, newBufferID, newPreviewID, newText, newHtml, newNumber);
    }

    this.addNewStep = function() {
        this.currentID += 1;

        var newText = '';
        var newHtml = '';

        var lastStep = this.lastStep();
        if(lastStep){
            newText = lastStep.text;
            newHtml = lastStep.html;
        }

        this.steps.push(this.createNewStep(newText, newHtml));
    };

    this.deleteStep = function(step) {
        var index = _.indexOf(this.steps, step);
        this.steps.splice(index, 1);
    }

    this.initStepsFromList = function(stepsList) {
        this.currentID = 0;
        this.steps = [];

        stepsList.forEach(function(step) {
            self.currentID += 1;
            var newStep = self.createNewStep(step.text, '', step.number);
            self.steps.push(newStep);
        });
    };
}
