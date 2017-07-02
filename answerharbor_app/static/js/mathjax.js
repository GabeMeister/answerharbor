var Preview = {
    delay: 150,        // delay after keystroke before updating
    questionPreview: null,     // filled in by Init below
    answerPreview: null,     // filled in by Init below
    questionBuffer: null,      // filled in by Init below
    answerBuffer: null,      // filled in by Init below
    timeout: null,     // store setTimout id
    mjRunning: false,  // true when MathJax is processing
    mjPending: false,  // true when a typeset has been queued
    oldAnswerText: null,     // used to check if an update is needed
    oldQuestionText: null,
    //
    //  Get the preview and buffer DIV's
    //
    Init: function (clearValues=false) {
        this.questionPreview = document.getElementById("mathjax-question-preview");
        this.questionBuffer = document.getElementById("mathjax-question-buffer");

        this.answerPreview = document.getElementById("mathjax-answer-preview");
        this.answerBuffer = document.getElementById("mathjax-answer-buffer");

        if (clearValues) {
            document.getElementById("answer").value = '';
            document.getElementById("question").value = '';
        }

        this.Update();
    },
    //
    //  Switch the buffer and preview, and display the right one.
    //  (We use visibility:hidden rather than display:none since
    //  the results of running MathJax are more accurate that way.)
    //
    SwapBuffers: function () {
        // The question buffer
        var tempQuestionBuffer = this.questionPreview;
        var tempQuestionPreview = this.questionBuffer;
        this.questionBuffer = tempQuestionBuffer;
        this.questionPreview = tempQuestionPreview;
        tempQuestionBuffer.style.visibility = "hidden";
        tempQuestionBuffer.style.position = "absolute";
        tempQuestionPreview.style.position = "";
        tempQuestionPreview.style.visibility = "";

        // The answer buffer
        var tempAnswerBuffer = this.answerPreview;
        var tempAnswerPreview = this.answerBuffer;
        this.answerBuffer = tempAnswerBuffer;
        this.answerPreview = tempAnswerPreview;
        tempAnswerBuffer.style.visibility = "hidden";
        tempAnswerBuffer.style.position = "absolute";
        tempAnswerPreview.style.position = "";
        tempAnswerPreview.style.visibility = "";
    },
    //
    //  This gets called when a key is pressed in the textarea.
    //  We check if there is already a pending update and clear it if so.
    //  Then set up an update to occur after a small delay (so if more keys
    //    are pressed, the update won't occur until after there has been
    //    a pause in the typing).
    //  The callback function is set up below, after the Preview object is set up.
    //
    Update: function () {
        if (this.timeout) { clearTimeout(this.timeout) }
        this.timeout = setTimeout(this.callback, this.delay);
    },
    //
    //  Creates the preview and runs MathJax on it.
    //  If MathJax is already trying to render the code, return
    //  If the text hasn't changed, return
    //  Otherwise, indicate that MathJax is running, and start the
    //    typesetting.  After it is done, call PreviewDone.
    //
    CreatePreview: function () {
        Preview.timeout = null;
        if (this.mjPending) {
            return;
        }

        // Update the answer
        var answerText = document.getElementById("answer").value;
        var questionText = document.getElementById("question").value;

        if (answerText === this.oldAnswerText && questionText === this.oldQuestionText) {
            return;
        }

        if (this.mjRunning) {
            this.mjPending = true;
            MathJax.Hub.Queue(["CreatePreview", this]);
        }
        else {
            this.answerBuffer.innerHTML = this.oldAnswerText = answerText;
            this.questionBuffer.innerHTML = this.oldQuestionText = questionText;
            this.mjRunning = true;
            MathJax.Hub.Queue(
                ["Typeset", MathJax.Hub, this.questionBuffer],
                ["Typeset", MathJax.Hub, this.answerBuffer],
                ["PreviewDone", this]
            );
        }
    },
    //
    //  Indicate that MathJax is no longer running,
    //  and swap the buffers to show the results.
    //
    PreviewDone: function () {
        this.mjRunning = this.mjPending = false;
        this.SwapBuffers();
    }
};
//
//  Cache a callback to the CreatePreview action
//
Preview.callback = MathJax.Callback(["CreatePreview", Preview]);
Preview.callback.autoReset = true;  // make sure it can run more than once
