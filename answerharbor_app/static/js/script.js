$(document).ready(function() {
    $('.confirm-link-click').click(function() {
        return confirm('Are you sure you want to delete this post?'); // cancel the event
    });
});
