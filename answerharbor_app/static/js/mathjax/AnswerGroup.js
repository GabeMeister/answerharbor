function AnswerGroup(name) {
    this.currentID = 0;
    this.name = name;
    this.answers = [];

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
