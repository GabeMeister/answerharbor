Vue.component('app', {
    template: `
        <div>
            <div>
                <h2 v-text="title"></h2>
            </div>

            <div>
                <span v-text="question.text"></span>
            </div>

            <br/>
            <div class="answer-separator"></div>

            <div>
                <div>
                    <h2>Answer:</h2>
                </div>

                <div>
<!--
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
-->
<!--
                    <div :class="{'hidden-step': !step.visible}">
                        <div class="step-count">
                            <span :class="{'visibility-hidden': !isLastVisibleStep(step)}" class="text-muted">
                                Step <span v-text="visibleStepCount"></span> / <span v-text="totalStepCount"></span>
                            </span>
                        </div>
                        <div>
                            <div
                                class="hidden-buffer"
                                :id="bufferID"
                                v-text="mathjaxText">
                            </div>
                            <div :id="step.bufferID" class="preview" v-html="step.text"></div>
                            <div :id="step.previewID" class="preview" v-html="step.text"></div>
                        </div>
                    </div>
-->

                </div>

                <div :class="{'hidden-step': !allStepsShowing}">
                    <div v-for="answer in answerGroup.answers" v-if="answerGroup.answers.length > 1">
                        <input @click="checkAnswer(answer.mathjax.text)" type="radio" :id="answer.mathjax.inputNameID" :value="answer.mathjax.text" v-model="selectedAnswer">
                        <label :for="answer.mathjax.inputNameID">
                            <div :id="answer.mathjax.previewID" v-html="answer.mathjax.text"></div>
                        </label>
                    </div>

                    <div v-if="answerGroup.answers.length === 1">
                        <h3 :for="answerGroup.answers[0].mathjax.inputNameID" class="preview center-text" :id="answerGroup.answers[0].mathjax.previewID" v-html="answerGroup.answers[0].mathjax.text"></h3>
                    </div>
                </div>

                <div>
                    <h1 v-if="answerAttempted" v-text="feedback" :class="{'incorrect-red': !correctAnswerGuessed, 'correct-green': correctAnswerGuessed}"></h1>
                </div>

                <div class="next-btn-wrapper">
                    <button class="btn btn-primary" @click="showNextStep" :disabled="!nextAvailable" v-if="!allStepsShowing">Next</button>
                    <a class="btn btn-success" role="button" :href="homeworkUrl" v-if="allStepsShowing">Back to Homework</a>
                </div>
            </div>
        </div>
    `,
    props: {
        homeworkUrl: {
            type: String,
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
            // return !_.some(this.stepGroup.steps, x => { return x.visible === false; });
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
