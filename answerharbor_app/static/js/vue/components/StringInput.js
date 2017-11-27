Vue.component('StringInput', {
    template: `
        <div>
            <div class="row">
                <div class="input-wrapper">
                    <input
                        type="text"
                        :id="id"
                        class="form-control"
                        :name="id"
                        v-model="text"
                        v-validate="'required'"
                        :placeholder="placeholder"
                        @keyup="update"/>
                    <span class="text-muted" v-show="errors.has(id)" v-text="errors.first(id)"></span>
                </div>
                <div class="preview-wrapper">
                    <h3 v-text="text" class="post-title-preview"></h3>
                </div>
            </div>
        </div>
    `,
    props: {
        // Required Props
        id: {
            type: String,
            required: true
        },

        // Optional Props
        initText: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    watch: {
        initText: function(val) {
            this.text = val;
        }
    },
    data() {
        return {
            text: this.initText
        };
    },
    methods: {
        update: function() {
            this.$emit('onUpdated', this.text);
        }
    }
});
