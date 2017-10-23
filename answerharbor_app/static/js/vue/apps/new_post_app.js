Vue.use(VeeValidate);

Vue.component('app', {
    template: `
        <div>
            <h1>Create a New Question + Answer:</h1>

            <h3>Title:</h3>
            <string-input
                id="question_title"
                :initText="title"
                @onUpdated="updateTitle"
                placeholder="Enter question title">
            </string-input>

            <h3>Question:</h3>
            <basic-mathjax-input
                :inputID="question.inputNameID"
                :bufferID="question.bufferID"
                :previewID="question.previewID"
                :placeholder="question.placeholder"
                :initMathjaxText="question.text"
                :mathjaxHtml="question.html"
                v-on:onUpdated="updateQuestion">
            </basic-mathjax-input>

            <div class="answer-separator edit-post-space"></div>

            <h3>Answer Steps:</h3>
            <div>
                <step-mathjax-input
                    v-for="step in stepGroup.steps"
                    :key="step.number"
                    class="row step-chunk"
                    :inputID="step.inputNameID"
                    :bufferID="step.bufferID"
                    :previewID="step.previewID"
                    :number="step.number"
                    :placeholder="step.placeholder"
                    :initMathjaxText="step.text"
                    :mathjaxHtml="step.html"
                    v-on:onUpdated="updateStep"
                    @onDelete="deleteStep">
                </step-mathjax-input>
            </div>

            <br/>

            <button class="btn btn-default" type="button" @click="addNewStep">New Step</button>

            <h3>Final Answer:</h3>
            <div>
                <div class="inline-radio-wrapper">
                    <input type="radio" class="inline-radio" id="auto-answer-type" name="type_input" value="auto" v-model="answerType">
                    <label for="auto-answer-type"><h5>Auto-Create Fake Answers</h5></label>
                </div>

                <div class="inline-radio-wrapper">
                    <input type="radio" class="inline-radio" id="custom-answers-radio" name="type_input" value="custom" v-model="answerType">
                    <label for="custom-answers-radio"><h5>Custom Answers</h5></label>
                </div>
            </div>

            <div v-if="answerType === 'auto'">
                <span class="text-muted"><i>Enter the correct answer, and have fake answers auto-generated for you.</i></span>

                <br/>
                <br/>

                <basic-mathjax-input
                    :inputID="finalAnswer.inputNameID"
                    :bufferID="finalAnswer.bufferID"
                    :previewID="finalAnswer.previewID"
                    :placeholder="finalAnswer.placeholder"
                    :initMathjaxText="finalAnswer.text"
                    :mathjaxHtml="finalAnswer.html"
                    v-on:onUpdated="updateFinalAnswer">
                </basic-mathjax-input>
            </div>
            <div v-if="answerType === 'custom'">
                <span class="text-muted"><i>Manually enter custom answers yourself. The first answer you enter should be the correct answer.</i></span>

                <br/>
                <br/>

                <div>
                    <basic-mathjax-input
                        class="custom-answer-input"
                        :key="customAnswer1.id"
                        :inputID="customAnswer1.inputNameID"
                        :bufferID="customAnswer1.bufferID"
                        :previewID="customAnswer1.previewID"
                        :placeholder="customAnswer1.placeholder"
                        :initMathjaxText="customAnswer1.text"
                        :mathjaxHtml="customAnswer1.html"
                        :rowCount="2"
                        v-on:onUpdated="updateCustomAnswer1">
                    </basic-mathjax-input>

                    <basic-mathjax-input
                        class="custom-answer-input"
                        :key="customAnswer2.id"
                        :inputID="customAnswer2.inputNameID"
                        :bufferID="customAnswer2.bufferID"
                        :previewID="customAnswer2.previewID"
                        :placeholder="customAnswer2.placeholder"
                        :initMathjaxText="customAnswer2.text"
                        :mathjaxHtml="customAnswer2.html"
                        :rowCount="2"
                        v-on:onUpdated="updateCustomAnswer2">
                    </basic-mathjax-input>

                    <basic-mathjax-input
                        class="custom-answer-input"
                        :key="customAnswer3.id"
                        :inputID="customAnswer3.inputNameID"
                        :bufferID="customAnswer3.bufferID"
                        :previewID="customAnswer3.previewID"
                        :placeholder="customAnswer3.placeholder"
                        :initMathjaxText="customAnswer3.text"
                        :mathjaxHtml="customAnswer3.html"
                        :rowCount="2"
                        v-on:onUpdated="updateCustomAnswer3">
                    </basic-mathjax-input>

                    <basic-mathjax-input
                        class="custom-answer-input"
                        :key="customAnswer4.id"
                        :inputID="customAnswer4.inputNameID"
                        :bufferID="customAnswer4.bufferID"
                        :previewID="customAnswer4.previewID"
                        :placeholder="customAnswer4.placeholder"
                        :initMathjaxText="customAnswer4.text"
                        :mathjaxHtml="customAnswer4.html"
                        :rowCount="2"
                        v-on:onUpdated="updateCustomAnswer4">
                    </basic-mathjax-input>
                </div>
            </div>

            <br/>
            <br/>

            <input class="btn btn-primary" @click="validateBeforeSubmit($event)" type='submit' value='Create'/>
        </div>
    `,
    data: function() {
        return {
            title: '',
            question: new MathjaxInput('question', '', '', 1, 'Enter question text'),
            stepGroup: new StepGroup('step'),
            answerType: 'auto',
            finalAnswer: new MathjaxInput('final_answer', '', '', 1, 'Enter final answer text'),
            customAnswer1: new MathjaxInput('custom1', '', '', 1, 'Enter correct answer text'),
            customAnswer2: new MathjaxInput('custom2', '', '', 2, 'Enter fake answer text'),
            customAnswer3: new MathjaxInput('custom3', '', '', 3, 'Enter fake answer text'),
            customAnswer4: new MathjaxInput('custom4', '', '', 4, 'Enter fake answer text')
        };
    },
    created: function() {
        window.imgurApiClientId = $('#imgur-api-client-id').text();
        var recoverPostKey = $('#recover-post-key').text();

        if(recoverPostKey !== '' && PostStorage.isValidPost(recoverPostKey)) {
            var savedPost = AutoSavedPost.loadFromLocalStorage(recoverPostKey);

            this.title = savedPost.title;
            this.question.updateText(savedPost.question.text);
            this.stepGroup.initStepsFromList(savedPost.stepGroup.steps);
            this.answerType = savedPost.answerType;

            if(this.answerType === 'auto') {
                this.finalAnswer.updateText(savedPost.finalAnswer.text);
            }
            else {
                this.customAnswer1.updateText(savedPost.customAnswer1.text);
                this.customAnswer2.updateText(savedPost.customAnswer2.text);
                this.customAnswer3.updateText(savedPost.customAnswer3.text);
                this.customAnswer4.updateText(savedPost.customAnswer4.text);
            }
        }
        else {
            var totalCurrentPosts = _.toInteger($('#homework-post-count').text());
            this.title = 'Question #' + (totalCurrentPosts + 1);
            this.stepGroup.addNewStep();
        }

        // Don't let user navigate away accidentally
        window.onbeforeunload = function() {
            return true;
        };

        // Auto-save every 3 seconds
        setInterval(this.autoSave, 3000);
    },
    methods: {
        autoSave: function() {
            autoSavePost(this.title, this.question, this.stepGroup, this.answerType, this.finalAnswer, this.customAnswer1, this.customAnswer2, this.customAnswer3, this.customAnswer4, 'new');
        },
        renderAll: function() {
            // Question
            this.question.createPreview();

            // All steps
            for(var i = 0; i < this.stepGroup.steps.length; i++) {
                this.stepGroup.steps[i].createPreview();
            }

            // Final Answer
            this.finalAnswer.createPreview();

            // Custom Answers
            this.customAnswer1.createPreview();
            this.customAnswer2.createPreview();
            this.customAnswer3.createPreview();
            this.customAnswer4.createPreview();
        },
        updateTitle: function(text) {
            this.title = text;
        },
        updateQuestion: function(text) {
            this.question.updateText(text);
        },
        updateFinalAnswer: function(text) {
            this.finalAnswer.updateText(text);
        },
        updateCustomAnswer1: function(text) {
            this.customAnswer1.updateText(text);
        },
        updateCustomAnswer2: function(text) {
            this.customAnswer2.updateText(text);
        },
        updateCustomAnswer3: function(text) {
            this.customAnswer3.updateText(text);
        },
        updateCustomAnswer4: function(text) {
            this.customAnswer4.updateText(text);
        },
        addNewStep: function() {
            this.stepGroup.addNewStep();
        },
        updateStep: function(text, number) {
            this.stepGroup.editStep(text, number);
        },
        deleteStep: function(number) {
            if(this.stepGroup.steps.length > 1 && confirm('Are you sure you want to delete this step?')){
                this.stepGroup.deleteStep(number);
            }
        },
        validateBeforeSubmit: function(event) {
            // Auto-save post before going anywhere
            this.autoSave();

            // If all inputs are valid, then we'll proceed to submit form.
            var valid = true;

            // Validate title
            if(this.title === '') {
                event.preventDefault();
                valid = false;
            }

            // Validate question
            if(valid && !this.question.isValid()) {
                event.preventDefault();
                valid = false;
            }

            // Validate all steps
            if(valid && !this.stepGroup.isValid()) {
                event.preventDefault();
                valid = false;
            }

            if(this.answerType === 'auto') {
                // Validate final answer
                if(valid && !this.finalAnswer.isValid()) {
                    event.preventDefault();
                    valid = false;
                }
            }
            else {
                // Check custom answers instead of final answer
                if(valid && !this.customAnswer1.isValid()) {
                    event.preventDefault();
                    valid = false;
                }

                if(valid && !this.customAnswer2.isValid()) {
                    event.preventDefault();
                    valid = false;
                }

                if(valid && !this.customAnswer3.isValid()) {
                    event.preventDefault();
                    valid = false;
                }

                if(valid && !this.customAnswer4.isValid()) {
                    event.preventDefault();
                    valid = false;
                }
            }


            // If user is submitting the form, then allow it without any popup
            if(valid) {
                window.onbeforeunload = null;
            }
        }
    }
});

var app = new Vue({
    el: '#app'
});
