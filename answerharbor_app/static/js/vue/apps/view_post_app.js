Vue.component('app', {
    template: `
        <div>
            <div>
                <h2 v-text="title"></h2>
            </div>

            <div>
                <basic-mathjax-preview
                    :bufferID="question.bufferID"
                    :previewID="question.previewID"
                    :mathjaxText="question.text"
                    :mathjaxHtml="question.html">
                </basic-mathjax-preview>
            </div>

            <br/>
            <div class="answer-separator"></div>

            <div>
                <h2>Answer:</h2>

                <div v-if="loggedIn">
                    <div>
                        <step-mathjax-preview
                            v-for="step in stepGroup.steps"
                            :key="step.number"
                            class="step-chunk"
                            :bufferID="step.bufferID"
                            :previewID="step.previewID"
                            :stepVisible="step.visible"
                            :stepCountVisible="isLastVisibleStep(step)"
                            :stepCount="visibleStepCount"
                            :totalStepCount="totalStepCount"
                            :mathjaxText="step.text"
                            :mathjaxHtml="step.html">
                        </step-mathjax-preview>
                    </div>

                    <br/>

                    <div :class="{'hidden-step': !allStepsShowing}">
                        <div v-for="answer in answerGroup.answers" v-if="answerGroup.answers.length > 1">
                            <input @click="checkAnswer(answer.mathjax.text)" type="radio" :id="answer.mathjax.inputNameID" :value="answer.mathjax.text" v-model="selectedAnswer">
                            <label :for="answer.mathjax.inputNameID">
                                <div :id="answer.mathjax.bufferID" class="hidden-buffer" v-text="answer.mathjax.text"></div>
                                <div class="preview" :id="answer.mathjax.previewID" v-html="answer.mathjax.html"></div>
                            </label>
                        </div>

                        <div v-if="answerGroup.answers.length === 1">
                            <h3
                                class="hidden-buffer"
                                :id="answerGroup.answers[0].mathjax.bufferID"
                                v-text="answerGroup.answers[0].mathjax.text">
                            </h3>
                            <h3
                                class="preview center-text"
                                :id="answerGroup.answers[0].mathjax.previewID"
                                v-html="answerGroup.answers[0].mathjax.html">
                            </h3>
                        </div>
                    </div>

                    <div>
                        <h1 v-if="answerAttempted" v-text="feedback" :class="{'incorrect-red': !correctAnswerGuessed, 'correct-green': correctAnswerGuessed}"></h1>
                    </div>

                    <div class="next-btn-wrapper">
                        <button class="btn btn-primary" @click="showNextStep" v-if="!allStepsShowing">Next</button>
                        <a class="btn btn-success" role="button" :href="homeworkUrl" v-if="allStepsShowing">Back to Homework</a>
                    </div>
                </div>

                <div v-if="!loggedIn">
                    <img class="centered-pic" src="https://i.imgur.com/Vjfbe0t.gif" alt="dj khaled wait">
                    <div class="page-title-wrapper">
                        <div class="page-title">
                            <h1>Hold Up.</h1>
                            <h2>Be sure to <a href="/login">log in</a> to see this answer.</h2>
                            <h2>If you haven't created your <b>free</b> account yet, you can <a href="/signup">sign up here</a>.</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        homeworkUrl: {
            type: String,
            required: true
        },
        loggedIn: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            postID: 0,
            title: '',
            question: new MathjaxPreview('question', ''),
            stepGroup: new StepGroup('step'),
            answerGroup: new AnswerGroup('answers'),
            selectedAnswer: '',
            correctAnswerGuessed: false,
            answerAttempted: false
        };
    },
    computed: {
        allStepsShowing: function() {
            // If all steps are showing, it should not have any step that isn't visible.
            return !_.some(this.stepGroup.steps, x => { return x.visible === false; });
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
            return _.filter(this.stepGroup.steps, x => { return x.visible; }).length;
        },
        totalStepCount: function() {
            return (this.stepGroup !== null && this.stepGroup.steps !== null)
                ? this.stepGroup.steps.length
                : 0;
        },
        correctAnswer: function() {
            return this.answerGroup.correctAnswer();
        },
        feedback: function() {
            return this.correctAnswerGuessed
                ? 'Correct!'
                : 'Incorrect, try again.';
        }
    },
    created: function() {
        var postID = $('#post-id').text();

        // Database call to get the post
        axios.get('/post_data/'+postID)
            .then(response => {
                this.title = response.data.title;
                this.question.updateText(response.data.question);
                this.stepGroup.initStepsFromList(response.data.steps);
                this.answerGroup.initAnswersFromList(response.data.answers);

                // Steps need to be hidden initially from the user.
                this.stepGroup.steps.forEach(step => {
                    step.visible = false;
                });

                // Hide all but the first step.
                this.stepGroup.steps[0].visible = true;

                this.renderAll();
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    methods: {
        renderAll: function() {
            // Question
            this.question.createPreview();

            // All steps
            this.stepGroup.steps.forEach(step => {
                step.createPreview();
            });

            // Final Answer
            this.answerGroup.answers.forEach(answer => {
                answer.mathjax.createPreview();
            });
        },
        showNextStep: function() {
            // Find the first step that isn't hidden
            for(var i = 1; i < this.stepGroup.steps.length; i++) {
                var step = this.stepGroup.steps[i];
                if(!step.visible) {
                    step.visible = true;

                    // Due to a limitation of javascript, in order for Vue to update we
                    // have to call Vue.set()
                    Vue.set(this.stepGroup.steps, i, step);

                    break;
                }
            }

        },
        isLastVisibleStep: function(step) {
            return step === this.lastVisibleStep;
        },
        checkAnswer: function(text) {
            this.answerAttempted = true;
            this.correctAnswerGuessed = (this.correctAnswer.mathjax.text === text);
        }
    }
});

var app = new Vue({
    el: '#app'
});
