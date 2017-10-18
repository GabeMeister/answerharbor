function AutoSavedPost() {
    this.title = '';
    this.question = null;
    this.stepGroup = null;
    this.finalAnswer = null;
    this.type = '';
    this.creationDate = new Date();

    this.setData = function(title, question, stepGroup, finalAnswer, type) {
        this.title = title;
        this.question = question;
        this.stepGroup = stepGroup;
        this.finalAnswer = finalAnswer;
        this.type = type;
    };

    this.print = function() {
        var output = '';

        output += 'TYPE: \n' + this.type + '\n\n\n';
        output += 'TITLE: \n' + this.title + '\n\n\n';
        output += 'QUESTION: \n' + this.question.text + '\n\n\n';
        this.stepGroup.steps.forEach(step => {
            output += 'STEP ' + step.number + ':\n' + step.text + '\n\n\n';
        });
        output += 'FINAL ANSWER: \n' + this.finalAnswer.text;

        console.log(output);
    };

    this.save = function() {
        var storageStr = JSON.stringify(this);
        console.log(storageStr);
    };

    this.load = function(key) {
        // TODO
    };
}
