Vue.use(VeeValidate);

function MathjaxInput(bufferID, previewID, inputNameID, text, html) {
    this.bufferID = bufferID;
    this.previewID = previewID;
    this.inputNameID = inputNameID;
    this.text = text;
    this.html = html;
    this.oldText = '';

    this.recordOldText = function() {
        this.oldText = this.text;
    }
}

function incrementID(prevID, prefix) {
    var num = prevID.replace(prefix, '');
    return prefix + _.toString(_.toInteger(num) + 1);
}

var app = new Vue({
    el: '#app',
    data: {
        question: new MathjaxInput('questionBuffer', 'questionPreview', 'questionInput', '', ''),
        steps: [],
        running: false,
        pending: false,
        timeoutID: 0,
        delay: 150
    },
    methods: {
        init: function() {
            this.steps.push(new MathjaxInput('stepBuffer1', 'stepPreview1', 'stepInput1', '', ''));
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
            var lastStep = this.steps[this.steps.length - 1];
            var newBufferID = incrementID(lastStep.bufferID, 'stepBuffer');
            var newPreviewID = incrementID(lastStep.previewID, 'stepPreview');
            var newInputNameID = incrementID(lastStep.inputNameID, 'stepInput');
            var newStep = new MathjaxInput(newBufferID, newPreviewID, newInputNameID, lastStep.text, lastStep.html);
            this.steps.push(newStep);
        },
        deleteStep: function(step) {
            if(this.steps.length > 1){
                var index = _.indexOf(this.steps, step);
                this.steps.splice(index, 1);
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
