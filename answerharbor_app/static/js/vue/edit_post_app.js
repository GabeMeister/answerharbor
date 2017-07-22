Vue.use(VeeValidate);

var app = new Vue({
    el: '#app',
    data: {
        postID: 0,
        question: new MathjaxInput('question_input', 'question_buffer', 'question_preview', '', ''),
        stepGroup: new StepGroup('step'),
        running: false,
        pending: false,
        timeoutID: 0,
        delay: 150
    },
    methods: {
        init: function() {
            var vm = this;

            // Database call to get the post
            var postID = $('#post-id').text();

            axios.get('/post_data/'+postID)
                .then(function(response) {
                    vm.question.text = response.data.question;
                    vm.update(vm.question);
                    vm.stepGroup.initStepsFromList(response.data.steps);
                    vm.updateAll();
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
            if(this.stepGroup.steps.length > 1){
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
