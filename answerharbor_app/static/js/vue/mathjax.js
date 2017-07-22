function MathjaxInput(inputNameID, bufferID, previewID, text, html) {
    this.inputNameID = inputNameID;
    this.bufferID = bufferID;
    this.previewID = previewID;
    this.text = text;
    this.html = html;
    this.oldText = '';

    this.recordOldText = function() {
        this.oldText = this.text;
    }
}

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

    this.addNewStep = function() {
        this.currentID += 1;

        var newInputNameID = name + "_" + inputPrefix + "_" + this.currentID.toString();
        var newBufferID = name + "_" + bufferPrefix + "_" + this.currentID.toString();
        var newPreviewID = name + "_" + previewPrefix + "_" + this.currentID.toString();
        var newText = '';
        var newHtml = '';

        var lastStep = this.lastStep();
        if(lastStep){
            newText = lastStep.text;
            newHtml = lastStep.html;
        }

        this.steps.push(new MathjaxInput(newInputNameID, newBufferID, newPreviewID, newText, newHtml));
    };
}
