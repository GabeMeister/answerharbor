Vue.component('ImgBtn', {
    template: `
        <button class="btn btn-default" @click="clicked" type="button">Image</button>
    `,
    data() {
        return {
            linkMarkdown: '![IMAGE_DESCRIPTION_HERE](IMAGE_URL_HERE)',
            beginIndex: 26,
            endIndex: 40
        };
    },
    methods: {
        clicked: function() {
            this.$emit('onClicked', this.addImg);
        },
        addImg: function(textareaElem) {
            var cursorPosition = textareaElem.selectionEnd;
            var text = textareaElem.value;

            var prefix = text.slice(0, cursorPosition);
            var suffix = text.slice(cursorPosition);
            var finalText = prefix + this.linkMarkdown + suffix;

            textareaElem.value = finalText;
            textareaElem.focus();
            textareaElem.setSelectionRange(cursorPosition + this.beginIndex, cursorPosition + this.endIndex);

            return finalText;
        }
    }
});
