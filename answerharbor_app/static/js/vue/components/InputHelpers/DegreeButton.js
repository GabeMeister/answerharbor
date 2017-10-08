Vue.component('DegreeBtn', {
    template: `
        <button class="btn btn-default" @click="clicked" type="button">&#176;</button>
    `,
    data() {
        return {
            linkMarkdown: '^\\circ',
            beginIndex: 6,
            endIndex: 6
        };
    },
    methods: {
        clicked: function() {
            this.$emit('onClicked', this.addDegree);
        },
        addDegree: function(textareaElem) {
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
