Vue.use(VeeValidate);

var app = new Vue({
    el: '#app',
    data: {
        title: '',
        question: new MathjaxInput('question_input', 'question_buffer', 'question_preview', '', ''),
        stepGroup: new StepGroup('step'),
        finalAnswer: new MathjaxInput('final_answer_input', 'final_answer_buffer', 'final_answer_preview', '', ''),
        running: false,
        pending: false,
        timeoutID: 0,
        delay: 150
    },
    methods: {
        init: function() {
            var postID = $('#post-id').text();

            // Database call to get the post
            axios.get('/post_data/'+postID)
            .then(response => {
                this.title = response.data.title;
                this.question.text = response.data.question;
                console.log('updating question', this.question);
                this.update(this.question);

                // TODO: refactor the way /post_data returns the data from the post.
                // Separate the fake answers from the correct answer so we don't have to
                // iterate here.
                for(var i = 0; i < response.data.answers.length; i++) {
                    if(response.data.answers[i].correct) {
                        this.finalAnswer.text = response.data.answers[i].text;
                        console.log('updating finalAnswer', this.finalAnswer);
                        this.update(this.finalAnswer);
                        break;
                    }
                }

                this.stepGroup.initStepsFromList(response.data.steps);

                this.$validator.updateDictionary(Validator.customErrorMessages());

                this.updateAll();
            })
            .catch(function(error) {
                console.log(error);
            });


        },
        update: function(input) {
            if(this.timeoutID) {
                clearTimeout(this.timeoutID);
            }

            this.timeoutID = setTimeout(MathJax.Callback(["createPreview", this, input]), this.delay);
        },
        updateAll: function() {
            this.timeoutID = 0;
            if(this.pending) {
                return;
            }

            if(this.running) {
                this.pending = true;
                MathJax.Hub.Queue(["updateAll", this]);
            }
            else {
                this.running = true;
                MathJax.Hub.Queue(
                    ["Typeset", MathJax.Hub]
                );

                for(var i = 0; i < this.stepGroup.steps.length; i++) {
                    MathJax.Hub.Queue(
                        ["displayMathjax", this, this.stepGroup.steps[i]]
                    );
                }
            }
        },
        createPreview: function(input) {
            this.timeoutID = 0;
            if(this.pending) {
                return;
            }

            if(input.oldText === input.text) {
                return;
            }

            if(this.running){
                this.pending = true;
                MathJax.Hub.Queue(["createPreview", this, input]);
            }
            else {
                input.recordOldText();
                this.running = true;
                MathJax.Hub.Queue(
                    ["Typeset", MathJax.Hub, input.bufferID],
                    ["displayMathjax", this, input]
                );
            }

        },
        displayMathjax: function(input) {
            this.running = false;
            this.pending = false;
            input.html = $('#'+input.bufferID).html();
        },
        addNewStep: function() {
            this.stepGroup.addNewStep();
        },
        deleteStep: function(step) {
            if(this.stepGroup.steps.length > 1 && confirm('Are you sure you want to delete this step?')){
                var stepInputNameID = step.inputNameID;
                this.stepGroup.deleteStep(step);
            }
        },
        validateBeforeSubmit: function(event) {
            // Validate all inputs
            this.$validator.validateAll().then(result => {
                if(!result){
                    // Prevent form from posting if there's stuff wrong with the inputs
                    event.preventDefault();
                }
            });

        }
    }
});

app.init();
