function AutoSavedPost() {
    this.title = '',
    this.question = new MathjaxInput('question', '', '', 1, 'Enter question text'),
    this.stepGroup = new StepGroup('step'),
    this.finalAnswer = new MathjaxInput('final_answer', '', '', 1, 'Enter final answer text')
    this.type = '';
    this.creationDate = new Date();
    this.version = 'v2';
    this.url = '';

    this.setData = function(title, question, stepGroup, finalAnswer, type, url) {
        this.title = title;
        this.question = question;
        this.stepGroup = stepGroup;
        this.finalAnswer = finalAnswer;
        this.type = type;
        this.url = url;
    };

    this.print = function() {
        console.log(this.toString());
    };

    this.toString = function() {
        // If any property is null, then just return blank string
        if(this.title === ''
            || this.question === null
            || this.stepGroup === null
            || this.finalAnswer === null
            || this.type === '') {
                return '';
        }

        var output = '';

        output += 'TYPE: \n' + this.type + '\n\n\n';
        output += 'TITLE: \n' + this.title + '\n\n\n';
        output += 'QUESTION: \n' + this.question.text + '\n\n\n';
        this.stepGroup.steps.forEach(step => {
            output += 'STEP ' + step.number + ':\n' + step.text + '\n\n\n';
        });
        output += 'FINAL ANSWER: \n' + this.finalAnswer.text;

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
