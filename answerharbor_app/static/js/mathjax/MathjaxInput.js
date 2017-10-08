function MathjaxInput(id, text, html, number = 1, placeholder='') {
    // Input Variables
    this.inputNameID = id + '_input';
    this.bufferID = id + '_buffer';
    this.previewID = id + '_preview';
    this.text = text;
    this.oldText = '';
    this.html = html;
    this.number = number;
    this.placeholder = placeholder;

    // Mathjax State Machine Variables
    this.running = false;
    this.pending = false;
    this.timeoutID = 0;
    this.delay = 150;

    // Methods
    this.recordOldText = function() {
        this.oldText = this.text;
    };

    this.updateText = function(text) {
        this.recordOldText();
        this.text = text;
        this.createPreview();
    };

    this.createPreview = function() {
        this.timeoutID = 0;
        if(this.pending) {
            return;
        }

        if(this.oldText === this.text) {
            return;
        }

        if(this.running){
            this.pending = true;

            MathJax.Hub.Queue(["createPreview", this]);
        }
        else {
            this.running = true;

            this.recordOldText();

            //Escape tags before doing stuff
            // this.text = this.escape(text);

            MathJax.Hub.Queue(
                ["Typeset", MathJax.Hub, this.bufferID],
                ["displayMathjax", this]
            );
        }
    };

    this.displayMathjax = function() {
        this.running = false;
        this.pending = false;

        var bufferHtml = $('#'+this.bufferID).html();
        bufferHtml = marked(bufferHtml);

        // TODO: make links open in new tab
        // var $preview = $(bufferHtml);

        this.html = bufferHtml;
    };

    this.isValid = function() {
        return this.text !== '';
    };

    this.escape = function(html, encode) {
        return html
            .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };
}
