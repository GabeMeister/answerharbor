Vue.use(VeeValidate);

Vue.component('app', {
    template: `
        <div>
            <h1>Recover Question</h1>

            <div v-if="savedPosts.length > 0">
                <p v-for="post in savedPosts" v-text="post"></p>
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
                this.savedPosts.push(this.generateUrl(key));
            }
        },
        generateUrl: function(key) {
            // TODO: actually generate url
            return key;
        }
    }
});

var app = new Vue({
    el: '#app'
});
