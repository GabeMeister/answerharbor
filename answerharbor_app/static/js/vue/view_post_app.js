const NORMAL_USER_SEC_DELAY = 15;
const ADMIN_USER_SEC_DELAY = 0;
const ONE_SECOND = 1000;

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
        userWaitTime: NORMAL_USER_SEC_DELAY,
        secondsLeft: NORMAL_USER_SEC_DELAY,
        timerID: 0,
        isAdmin: false
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
        },
        lastVisibleStep: function() {
            var lastVisibleStep = null;

            for(var i = 0; i < this.stepGroup.steps.length; i++) {
                var step = this.stepGroup.steps[i];
                var nextStep = (i+1 < this.stepGroup.steps.length) ? this.stepGroup.steps[i+1] : null;

                // The last visible step is defined as one of the following:
                // (1) the next step after it doesn't exist
                // (2) the next step is non-visible
                if(nextStep === null || !nextStep.visible) {
                    lastVisibleStep = step;
                    break;
                }
            }

            return lastVisibleStep;
        },
        visibleStepCount: function() {
            var count = 0;
            for(var i = 0; i < this.stepGroup.steps.length; i++) {
                var step = this.stepGroup.steps[i];
                if(step.visible) {
                    count++;
                }
                else {
                    break;
                }
            }

            return count;
        },
        totalStepCount: function() {
            var count = 0;
            if(this.stepGroup !== null && this.stepGroup.steps !== null) {
                count = this.stepGroup.steps.length;
            }

            return count;
        }
    },
    methods: {
        init: function() {
            var postID = $('#post-id').text();

            // Database call to get the post
            axios.get('/post_data/'+postID)
            .then(response => {
                this.question.text = response.data.question;
                this.update(this.question);
                this.stepGroup.initStepsFromList(response.data.steps);

                // Steps need to be hidden initially from the user.
                // Hide all but the first step.
                this.stepGroup.steps[0].visible = true;

                for(var i = 1; i < this.stepGroup.steps.length; i++) {
                    this.stepGroup.steps[i].visible = false;
                }

                this.updateAll();
            })
            .catch(function(error) {
                console.log(error);
            });

            this.setUserWaitTime();

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

                    if(this.userWaitTime > 0){
                        // Disable the button for a certain time to let the user write the step down.
                        // Only for non-admin users.
                        this.secondsLeft = this.userWaitTime;
                        this.timerID = setInterval(() => {
                            this.secondsLeft = this.secondsLeft - 1;
                            if(this.secondsLeft <= 0) {
                                this.nextAvailable = true;
                                clearInterval(this.timerID);
                            }
                        }, ONE_SECOND);
                    }
                    else {
                        this.nextAvailable = true;
                    }

                    break;
                }
            }

        },
        setUserWaitTime: function() {
            // Check if user is logged in and is an admin user.
            // If so, there's no delay. Otherwise, there will be a delay between steps.
            axios.get('/is_admin')
            .then(response => {
                this.userWaitTime = response.data.is_admin ? ADMIN_USER_SEC_DELAY : NORMAL_USER_SEC_DELAY;
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        isLastVisibleStep: function(step){
            return step === this.lastVisibleStep;
        }
    }
});

app.init();
