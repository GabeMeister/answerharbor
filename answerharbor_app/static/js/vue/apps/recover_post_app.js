Vue.use(VeeValidate);

Vue.component('app', {
    template: `
        <div>
            <h1>Recover Question</h1>

            <p v-for="post in savedPosts" v-text="post"></p>
        </div>
    `,
    data: function() {
        return {
            savedPosts: []
        };
    },
    created: function() {
        for(var item in localStorage) {
            this.savedPosts.push(item);
        }
    },
    methods: {

    }
});

var app = new Vue({
    el: '#app'
});
