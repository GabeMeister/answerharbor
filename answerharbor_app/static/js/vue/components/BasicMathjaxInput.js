Vue.component('BasicMathjaxInput', {
    template: `
        <div class="row">
            <div class="input-wrapper">
                <div class="btn-menu">
                    <link-btn @onClicked="addLink"></link-btn>
                    <img-btn @onClicked="addImg"></img-btn>
                    <degree-btn @onClicked="addDegree"></degree-btn>
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

        // Optional Props
        mathjaxHtml: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Enter text'
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
            this.$emit('onUpdated', this.mathjaxText);
        },
        addLink: function(callback) {
            this.mathjaxText = callback(this.textAreaElem);
            this.$emit('onUpdated', this.mathjaxText);
        },
        addImg: function(callback) {
            this.mathjaxText = callback(this.textAreaElem);
            this.$emit('onUpdated', this.mathjaxText);
        },
        addDegree: function(callback) {
            this.mathjaxText = callback(this.textAreaElem);
            this.$emit('onUpdated', this.mathjaxText);
        }
    }
});
