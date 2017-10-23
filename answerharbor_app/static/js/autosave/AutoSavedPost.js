function AutoSavedPost() {
    this.title = '';
    this.question = new MathjaxInput('question', '', '', 1, 'Enter question text');
    this.stepGroup = new StepGroup('step');
    this.answerType = 'auto';
    this.finalAnswer = new MathjaxInput('final_answer', '', '', 1, 'Enter final answer text');
    this.customAnswer1 = new MathjaxInput('custom1', '', '', 1, 'Enter correct answer text');
    this.customAnswer2 = new MathjaxInput('custom2', '', '', 2, 'Enter fake answer text');
    this.customAnswer3 = new MathjaxInput('custom3', '', '', 3, 'Enter fake answer text');
    this.customAnswer4 = new MathjaxInput('custom4', '', '', 4, 'Enter fake answer text');
    this.submitType = '';
    this.creationDate = new Date();
    this.version = 'v2';
    this.url = '';

    this.setData = function(title, question, stepGroup, answerType, finalAnswer, customAnswer1, customAnswer2, customAnswer3, customAnswer4, submitType, url) {
        this.title = title;
        this.question = question;
        this.stepGroup = stepGroup;
        this.answerType = answerType;
        this.finalAnswer = finalAnswer;
        this.customAnswer1 = customAnswer1;
        this.customAnswer2 = customAnswer2;
        this.customAnswer3 = customAnswer3;
        this.customAnswer4 = customAnswer4;
        this.submitType = submitType;
        this.url = url;
    };

    this.print = function() {
        console.log(this.toString());
    };

    this.toString = function() {
        var output = '';

        output += 'TYPE: \n' + this.submitType + '\n\n\n';
        output += 'TITLE: \n' + this.title + '\n\n\n';
        output += 'QUESTION: \n' + this.question.text + '\n\n\n';
        this.stepGroup.steps.forEach(step => {
            output += 'STEP ' + step.number + ':\n' + step.text + '\n\n\n';
        });
        output += 'ANSWER TYPE: ' + this.answerType + '\n\n\n';
        if(this.answerType === 'auto') {
            output += 'FINAL ANSWER: \n' + this.finalAnswer.text;
        }
        else {
            output += 'CUSTOM ANSWER 1: \n' + this.customAnswer1.text + '\n\n';
            output += 'CUSTOM ANSWER 2: \n' + this.customAnswer2.text + '\n\n';
            output += 'CUSTOM ANSWER 3: \n' + this.customAnswer3.text + '\n\n';
            output += 'CUSTOM ANSWER 4: \n' + this.customAnswer4.text + '\n\n';
        }

        return output;
    }

    this.isSameAs = function(otherPost) {
        return this.toString() === otherPost.toString();
    }

    this.save = function() {
        // Remove recover_post_key from url if possible
        this.url = removeParam('recover_post_key', this.url);

        localStorage.setItem(this.title, JSON.stringify(this));
        console.log('Saved');
    };

    this.deleteIfExpired = function() {
        var oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        // If a post is greater than 1 month old, then just delete it
        if(this.creationDate < oneMonthAgo) {
            localStorage.removeItem(this.title);
        }
    }
}

AutoSavedPost.loadFromLocalStorage = function(key) {
    var savedPost = new AutoSavedPost();
    Object.assign(savedPost, JSON.parse(localStorage.getItem(key)));

    // Javascript dates get saved as strings.
    // Convert the date string back to an object
    savedPost.creationDate = new Date(savedPost.creationDate);

    return savedPost;
}
