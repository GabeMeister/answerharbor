Vue.use(VeeValidate);

var app = new Vue({
    el: '#app',
    data: {
        postID: 0,
        title: '',
        question: new MathjaxInput('question_input', 'question_buffer', 'question_preview', '', ''),
        stepGroup: new StepGroup('step'),
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
                    this.update(this.question);
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
