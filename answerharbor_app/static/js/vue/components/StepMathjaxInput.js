Vue.component('StepMathjaxInput', {
    template: `
        <div class="row step-chunk">
            <div class="delete-btn-wrapper">
                <img @click="deleteStep" class="x-btn" src="/static/img/x-btn.png"/>
            </div>
            <div class="input-wrapper">
                <div class="btn-menu">
                    <div>
                        <link-btn @onClicked="addLink"></link-btn>
                        <img-btn @onClicked="addImg"></img-btn>
                    </div>
                    <div>
                        <degree-btn @onClicked="addDegree"></degree-btn>
                    </div>
                </div>
                <textarea
                    class="input-text-area form-control"
                    rows="8"
                    :placeholder="placeholder"
                    :id="inputID"
                    :name="inputID"
                    v-validate="'required'"
                    v-model="mathjaxText"
                    @keyup="update">
                </textarea>
                <span
                    class="text-muted"
                    v-show="errors.has(inputID)"
                    v-text="errors.first(inputID)">
                </span>
            </div>
            <div class="preview-wrapper">
                <div
                    class="hidden-buffer"
                    :id="bufferID"
                    v-text="mathjaxText">
                </div>
                <div
                    class="preview"
                    :id="previewID"
                    v-html="mathjaxHtml">
                </div>
            </div>
        </div>
    `,
    props: {
        // Initializer Props
        initMathjaxText: {
            type: String,
            default: ''
        },

        // Required Props
        inputID: {
            type: String,
            required: true
        },
        bufferID: {
            type: String,
            required: true
        },
        previewID: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        },

        // Optional Props
        mathjaxHtml: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    watch: {
        initMathjaxText: function(val) {
            // Need to update mathjax text after the data pull
            this.mathjaxText = val;
        }
    },
    computed: {
        textAreaElem: function() {
            return $('#'+this.inputID)[0];
        }
    },
    data() {
        return {
            mathjaxText: this.initMathjaxText
        };
    },
    methods: {
        update: function() {
            this.$emit('onUpdated', this.mathjaxText, this.number);
        },
        deleteStep: function() {
            this.$emit('onDelete', this.number);
        },
        addLink: function(callback) {
            this.mathjaxText = callback(this.textAreaElem);
            this.update();
        },
        addImg: function(callback) {
            this.mathjaxText = callback(this.textAreaElem);
            this.update();
        },
        addDegree: function(callback) {
            this.mathjaxText = callback(this.textAreaElem);
            this.update();
        }
    }
});
