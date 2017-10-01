Vue.use(VeeValidate);

Vue.component('app', {
    template: `
        <div>
            <h1>Edit Question + Answer:</h1>

            <h3>Title:</h3>
            <div class="row">
                <div class="input-wrapper">
                    <input type="text" name="question_title" v-model="title" class="form-control" v-validate="'required'" placeholder="Enter question title"/>
                    <span v-show="errors.has('question_title')" v-text="errors.first('question_title')"></span>
                </div>
                <div class="preview-wrapper">
                    <h3 v-text="title" class="post-title-preview"></h3>
                </div>
            </div>

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

            <input class="btn btn-primary" @click="validateBeforeSubmit($event)" type='submit' value='Save Edits'/>
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
        var postID = $('#post-id').text();

        // Database call to get the post
        axios.get('/post_data/'+postID)
            .then(response => {
                this.title = response.data.title;
                this.question.text = response.data.question;

                // TODO: refactor the way /post_data returns the data from the post.
                // Separate the fake answers from the correct answer so we don't have to
                // iterate here.
                for(var i = 0; i < response.data.answers.length; i++) {
                    if(response.data.answers[i].correct) {
                        this.finalAnswer.text = response.data.answers[i].text;
                        break;
                    }
                }

                this.stepGroup.initStepsFromList(response.data.steps);

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
            for(var i = 0; i < this.stepGroup.steps.length; i++) {
                this.stepGroup.steps[i].createPreview();
            }

            // Final Answer
            this.finalAnswer.createPreview();
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

var app = new Vue({
    el: '#app'
});
