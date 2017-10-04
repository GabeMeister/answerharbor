Vue.component('BasicMathjaxPreview', {
    template: `
        <div>
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
    `,
    props: {
        // Required Props
        bufferID: {
            type: String,
            required: true
        },
        previewID: {
            type: String,
            required: true
        },
        mathjaxText: {
            type: String,
            required: true
        },
        mathjaxHtml: {
            type: String,
            required: true
        }
    }
});
