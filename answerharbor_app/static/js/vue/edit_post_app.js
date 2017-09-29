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
            <div class="question-wrapper">
                <div class="row">
                    <div class="input-wrapper">
                        <textarea v-validate="'required'" :name="question.inputNameID" class="input-text-area form-control" rows="8" v-model="question.text" @keyup="update(question)"></textarea>
                        <span class="text-muted" v-show="errors.has(question.inputNameID)" v-text="errors.first(question.inputNameID)"></span>
                    </div>
                    <div class="preview-wrapper">
                        <p :id="question.bufferID" v-text="question.text" class="hidden-buffer"></p>
                        <p class="preview" :id="question.previewID" v-html="question.html"></p>
                    </div>
                </div>
            </div>

            <div class="answer-separator edit-post-space"></div>

            <h3>Answer Steps:</h3>
            <div class="steps-wrapper">
                <div class="row step-chunk" v-for="step in stepGroup.steps">
                    <div class="delete-btn-wrapper">
                        <img @click="deleteStep(step)" class="x-btn" src="/static/img/x-btn.png"/>
                    </div>
                    <div class="input-wrapper">
                        <textarea v-validate="'required'" :name="step.inputNameID" class="input-text-area form-control" rows="8" v-model="step.text" @keyup="update(step)" placeholder="Enter step text"></textarea>
                        <span class="text-muted" v-show="errors.has(step.inputNameID)" v-text="errors.first(step.inputNameID)"></span>
                    </div>
                    <div class="preview-wrapper">
                        <p :id="step.bufferID" v-text="step.text" class="hidden-buffer"></p>
                        <p class="preview" :id="step.previewID" v-html="step.html"></p>
                    </div>
                </div><br/>

                <button class="btn btn-default" type="button" @click="addNewStep">New Step</button>
            </div>

            <h3>Final Answer:</h3>
            <div>
                <div class="row final-answer-row">
                    <div class="input-wrapper">
                        <textarea v-validate="'required'" :name="finalAnswer.inputNameID" class="input-text-area form-control" rows="4" v-model="finalAnswer.text" @keyup="update(finalAnswer)" placeholder="Enter final answer"></textarea>
                        <span class="text-muted" v-show="errors.has(finalAnswer.inputNameID)" v-text="errors.first(finalAnswer.inputNameID)"></span>
                    </div>
                    <div class="preview-wrapper">
                        <p :id="finalAnswer.bufferID" v-text="finalAnswer.text" class="hidden-buffer"></p>
                        <p class="preview" :id="finalAnswer.previewID" v-html="finalAnswer.html"></p>
                    </div>
                </div>
            </div>

            <br/>
            <br/>
            <input class="btn btn-primary" @click="validateBeforeSubmit($event)" type='submit' value='Save Edits'/>
        </div>
    `,
    data: function() {
        return {
            title: '',
            question: new MathjaxInput('question_input', 'question_buffer', 'question_preview', '', '', 1),
            stepGroup: new StepGroup('step'),
            finalAnswer: new MathjaxInput('final_answer_input', 'final_answer_buffer', 'final_answer_preview', '', '', 1),
            running: false,
            pending: false,
            timeoutID: 0,
            delay: 150
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

                this.updateAll();
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    methods: {
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

                // Display question mathjax
                MathJax.Hub.Queue(
                    ["displayMathjax", this, this.question]
                );

                // Display final answer mathjax
                MathJax.Hub.Queue(
                    ["displayMathjax", this, this.finalAnswer]
                );

                // Display mathjax for all steps
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

var app = new Vue({
    el: '#app'
});
