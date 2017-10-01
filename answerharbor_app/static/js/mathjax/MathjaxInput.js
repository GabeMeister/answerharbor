function MathjaxInput(id, text, html, number, placeholder='') {
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
            MathJax.Hub.Queue(
                ["Typeset", MathJax.Hub, this.bufferID],
                ["displayMathjax", this]
            );
        }
    };

    this.displayMathjax = function() {
        this.running = false;
        this.pending = false;

        this.html = $('#'+this.bufferID).html();
    };
}
