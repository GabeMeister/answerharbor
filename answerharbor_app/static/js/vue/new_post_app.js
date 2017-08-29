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
            var totalCurrentPosts = _.toInteger($('#homework-post-count').text());
            this.title = 'Question #' + (totalCurrentPosts + 1);

            this.stepGroup.addNewStep();
        },
        update: function(step) {
            if(this.timeoutID) {
                clearTimeout(this.timeoutID);
            }

            this.timeoutID = setTimeout(MathJax.Callback(["createPreview", this, step]), this.delay);
        },
        createPreview: function(input) {
            // For whatever reason, sometimes step is undefined when you rapidly type keys. Avoid
            // doing anything if step is undefined
            if(input === undefined){
                return;
            }

            this.timeoutID = 0;
            if(this.pending) {
                return;
            }

            if(input.oldText === input.text) {
                return;
            }

            if(this.running){
                this.pending = true;
                MathJax.Hub.Queue(["createPreview", this]);
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
                var index = _.indexOf(this.stepGroup.steps, step);
                this.stepGroup.steps.splice(index, 1);
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
