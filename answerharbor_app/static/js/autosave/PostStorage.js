function PostStorage() {}

PostStorage.version = 'v2';

PostStorage.clearOldPosts = function() {
    for(var key in localStorage) {
        if(!PostStorage.isValidPost(key)) {
            localStorage.removeItem(key);
        }
    }
}

PostStorage.isValidPost = function(key) {
    // If it's JSON and it's version 2, then it's a valid post.

    var valid = true;

    try {
        var post = AutoSavedPost.loadFromLocalStorage(key);
        if(post.version !== PostStorage.version) {
            valid = false;
        }
    }
    catch (e) {
        // The post data isn't JSON parsable, so it can't be valid.
        valid = false;
    }

    return valid;
}
