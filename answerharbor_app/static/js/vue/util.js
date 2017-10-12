function incrementID(prevID, prefix) {
    var num = prevID.replace(prefix, '');
    return prefix + _.toString(_.toInteger(num) + 1);
}

function autoSavePost(title, question, stepGroup, finalAnswer) {
    var storageStr = '';

    storageStr += 'TITLE: \n' + title + '\n\n\n';
    storageStr += 'QUESTION: \n' + question.text + '\n\n\n';
    stepGroup.steps.forEach(step => {
        storageStr += 'STEP ' + step.number + ':\n' + step.text + '\n\n\n';
    });
    storageStr += 'FINAL ANSWER: \n' + finalAnswer.text;

    if(storageStr !== localStorage.getItem(title)) {
        console.log('Saving post...');
        localStorage.setItem(title, storageStr);
    }
}

function getAutoSavedPost(key) {
    console.log(localStorage.getItem(key));
}

function listAutoSavedPosts() {
    for(var key in localStorage) {
        console.log(key);
    }
}
