function AnswerGroup(name) {
    this.currentID = 0;
    this.name = name;
    this.answers = [];

    this.lastAnswer = function() {
        var index = this.answers.length - 1;
        return (index >= 0)
            ? this.answers[index]
            : null;
    };

    this.generateID = function(prefix) {
        return prefix + "_" + this.currentID.toString();
    };

    this.createNewAnswer = function(text = '', html = '', isCorrect = false) {
        this.currentID += 1;
        var id = this.generateID('answer');
        return {
            'mathjax': new MathjaxInput(id, text, html, this.currentID),
            'correct': isCorrect
        };
    };

    this.addNewAnswer = function() {
        var newText = '';
        var newHtml = '';
        var newCorrect = false;

        var lastAnswer = this.lastAnswer();
        if(lastAnswer){
            newText = lastAnswer.mathjax.text;
            newHtml = lastAnswer.mathjax.html;
        }
        else {
            // The first custom answer will be true.
            // The rest will be false.
            newCorrect = true;
        }

        this.answers.push(this.createNewAnswer(newText, newHtml, newCorrect));
    };

    this.editAnswer = function(text, number) {
        var index = _.findIndex(this.answers, x => { return x.number === number; });
        this.answers[index].mathjax.updateText(text);
    };

    this.initAnswersFromList = function(answerList) {
        this.currentID = 0;
        this.answers = [];
        answerList.forEach(answer => {
            var newAnswer = this.createNewAnswer(answer.text, '', answer.correct);
            this.answers.push(newAnswer);
        });
    };

    this.correctAnswer = function() {
        var answer = null;
        this.answers.forEach(ans => {
            if(ans.correct) {
                answer = ans;
                return;
            }
        });

        return answer;
    }
}
