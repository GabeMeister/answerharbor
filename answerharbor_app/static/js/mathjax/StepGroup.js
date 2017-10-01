function StepGroup(name) {
    const inputPrefix = 'input';
    const bufferPrefix = 'buffer';
    const previewPrefix = 'preview';

    this.currentID = 0;
    this.name = name;
    this.steps = [];

    this.lastStep = function() {
        return this.steps[this.steps.length - 1];
    };

    this.generateID = function(prefix) {
        return prefix + "_" + this.currentID.toString();
    }

    this.createNewStep = function(text = '', html = '') {
        this.currentID += 1;
        var id = this.generateID('step');

        return new MathjaxInput(id, text, html, this.currentID, 'Enter step text');
    }

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
    }

    this.deleteStep = function(number) {
        console.log('number: ', number);
        var index = _.findIndex(this.steps, x => { return x.number === number; });
        console.log('index: ', index);
        this.steps.splice(index, 1);
    }

    this.initStepsFromList = function(stepsList) {
        this.currentID = 0;
        this.steps = [];

        stepsList.forEach(step => {
            var newStep = this.createNewStep(step.text, '');
            this.steps.push(newStep);
        });
    };
}
