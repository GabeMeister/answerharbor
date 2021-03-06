Vue.component('LinkBtn', {
    template: `
        <button class="btn btn-default" @click="clicked" type="button">Link</button>
    `,
    data() {
        return {
            linkMarkdown: '[TEXT_HERE](URL_HERE)',
            beginIndex: 12,
            endIndex: 20
        };
    },
    methods: {
        clicked: function() {
            this.$emit('onClicked', this.addLink);
        },
        addLink: function(textareaElem) {
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
