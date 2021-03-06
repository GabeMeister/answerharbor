function autoSavePost(title, question, stepGroup, answerType, finalAnswer, customAnswer1, customAnswer2, customAnswer3, customAnswer4, submitType) {
    // Get post that was autosaved from before
    var prevPost = AutoSavedPost.loadFromLocalStorage(title);

    // Create post with current data
    var currPost = new AutoSavedPost();
    currPost.setData(title, question, stepGroup, answerType, finalAnswer, customAnswer1, customAnswer2, customAnswer3, customAnswer4, submitType, window.location.href);

    // Compare if any data was changed, and if so, save it
    if(!currPost.isSameAs(prevPost)) {
        currPost.save();
    }

    // Every time we save, check for stale posts that need to be deleted
    clearExpiredPosts();
}

function printPost(key) {
    var post = AutoSavedPost.loadFromLocalStorage(key);
    post.print();
}

function listPosts() {
    for(var key in localStorage) {
        console.log(key);
    }
}

function clearExpiredPosts() {
    for(var key in localStorage) {
        var post = AutoSavedPost.loadFromLocalStorage(key);
        post.deleteIfExpired();
    }
}
