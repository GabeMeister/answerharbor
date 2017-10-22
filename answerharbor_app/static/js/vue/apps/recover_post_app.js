Vue.use(VeeValidate);

Vue.component('app', {
    template: `
        <div>
            <h1>Recover Question</h1>

            <div v-if="savedPosts.length > 0">
                <a v-for="post in savedPosts" :href="post.url"><h1 v-text="post.title"></h1></a>
            </div>
            <div class="page-title" v-if="savedPosts.length === 0">
                <h2>Looks like there's no posts to recover!</h2>
            </div>
        </div>
    `,
    data: function() {
        return {
            savedPosts: []
        };
    },
    created: function() {
        PostStorage.clearOldPosts();
        this.initPosts();
    },
    methods: {
        initPosts: function() {
            for(var key in localStorage) {
                if(PostStorage.isValidPost(key)) {
                    var post = AutoSavedPost.loadFromLocalStorage(key);
                    // Add recover_post_key flag to load from localStorage
                    post.url = post.url + '&recover_post_key=' + encodeURIComponent(post.title);

                    this.savedPosts.push(post);
                }
            }

            // Most recently created posts first
            this.savedPosts.sort((postA, postB) => {
                if(postA.creationDate === postB.creationDate) {
                    return 0;
                }
                return (postA.creationDate > postB.creationDate) ?  -1 : 1;
            });
        }
    }
});

var app = new Vue({
    el: '#app'
});
