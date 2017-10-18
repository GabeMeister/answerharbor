function autoSavePost(title, question, stepGroup, finalAnswer, type) {
    var autoSavedPost = new AutoSavedPost();
    autoSavedPost.setData(title, question, stepGroup, finalAnswer, type);
    autoSavedPost.save();
}

function getAutoSavedPost(key) {
    console.log(localStorage.getItem(key));
}

function listAutoSavedPosts() {
    for(var key in localStorage) {
        console.log(key);
    }
}
