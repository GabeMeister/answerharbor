Vue.component('StepMathjaxPreview', {
    template: `
        <div :class="{'hidden-step': !stepVisible}">
            <div class="step-count">
                <span :class="{'visibility-hidden': !stepCountVisible}" class="text-muted">
                    Step <span v-text="stepCount"></span> / <span v-text="totalStepCount"></span>
                </span>
            </div>
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
        stepVisible: {
            type: Boolean,
            required: true
        },
        stepCountVisible: {
            type: Boolean,
            required: true
        },
        stepCount: {
            type: Number,
            required: true
        },
        totalStepCount: {
            type: Number,
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
