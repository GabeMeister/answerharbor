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
            <basic-mathjax-input
                :inputID="finalAnswer.inputNameID"
                :bufferID="finalAnswer.bufferID"
                :previewID="finalAnswer.previewID"
                :placeholder="finalAnswer.placeholder"
                :initMathjaxText="finalAnswer.text"
                :mathjaxHtml="finalAnswer.html"
                v-on:onUpdated="updateFinalAnswer">
            </basic-mathjax-input>

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
            finalAnswer: new MathjaxInput('final_answer', '', '', 1, 'Enter final answer text')
        };
    },
    created: function() {
        window.imgurApiClientId = $('#imgur-api-client-id').text();
        var recoverPostKey = $('#recover-post-key').text();

        if(recoverPostKey !== '' && PostStorage.isValidPost(recoverPostKey)) {
            console.log('recover post key found: ', recoverPostKey);

            var savedPost = AutoSavedPost.loadFromLocalStorage(recoverPostKey);

            this.title = savedPost.title;
            this.question.updateText(savedPost.question.text);
            this.stepGroup.initStepsFromList(savedPost.stepGroup.steps);
            this.finalAnswer.updateText(savedPost.finalAnswer.text);

            this.renderAll();
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

        // Auto-save every 10 seconds
        setInterval(this.autoSave, 10000);
    },
    methods: {
        autoSave: function() {
            autoSavePost(this.title, this.question, this.stepGroup, this.finalAnswer, 'new');
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

            // Validate final answer
            if(valid && !this.finalAnswer.isValid()) {
                event.preventDefault();
                valid = false;
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
