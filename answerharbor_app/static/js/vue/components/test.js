Vue.component('test', {
    template: `
        <div>
            <textarea type="text" :name="testID" v-model="msg" @keyup="updateMsg" placeholder="Enter question text"></textarea>
            <div v-text="msg"></div>
        </div>
    `,
    props: {
        initMsg: {
            type: String,
            required: true
        },
        testID: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            msg: this.initMsg
        };
    },
    methods: {
        updateMsg: function() {
            this.$emit('onUpdated', this.msg);
        },
        printMsg() {
            console.log('yup');
        }
    }
});
