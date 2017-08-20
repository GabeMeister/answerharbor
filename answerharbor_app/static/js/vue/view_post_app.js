const SECONDS_DELAY = 5;

var app = new Vue({
    el: '#app',
    data: {
        postID: 0,
        question: new MathjaxInput('question_input', 'question_buffer', 'question_preview', '', ''),
        stepGroup: new StepGroup('step'),
        running: false,
        pending: false,
        timeoutID: 0,
        delay: 150,
        nextAvailable: true,
        secondsLeft: SECONDS_DELAY,
        timerID: 0
    },
    computed: {
        allStepsShowing: function() {
            for(var i = 0; i < this.stepGroup.steps.length; i++) {
                var step = this.stepGroup.steps[i];
                if(step.visible == false) {
                    return false;
                }
            }

            return true;
        }
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

                // Steps need to be hidden initially from the user.
                // Hide all but the first step.
                vm.stepGroup.steps[0].visible = true;

                for(var i = 1; i < vm.stepGroup.steps.length; i++) {
                    vm.stepGroup.steps[i].visible = false;
                }

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
        showNextStep: function() {
            this.nextAvailable = false;

            // Find the first step that isn't hidden
            for(var i = 1; i < this.stepGroup.steps.length; i++) {
                var step = this.stepGroup.steps[i];
                if(!step.visible) {
                    step.visible = true;

                    // Due to a limitation of javascript, in order for Vue to update we
                    // have to call Vue.set()
                    Vue.set(this.stepGroup.steps, i, step);

                    // Disable the button for a certain time to let the user write the step down
                    this.timerID = setInterval(() => {
                        this.secondsLeft = this.secondsLeft - 1;
                        if(this.secondsLeft === 0) {
                            this.nextAvailable = true;
                            this.secondsLeft = SECONDS_DELAY;
                            clearInterval(this.timerID);
                        }
                    }, 1000);

                    break;
                }
            }

        }
    }
});

app.init();
