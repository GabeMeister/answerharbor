const { exec } = require('child_process');
const { Chromeless } = require('chromeless');

module.exports = {
    createChromeless: function() {
        return new Chromeless({
            launchChrome: false,
            scrollBeforeClick: true
        });
    },

    // Example Usage:
    // var ci = require('./helpers/ci');
    //
    // await ci.screenshot(chromeless);
    screenshot: async function(chromeless) {
        let screenshot = await chromeless
            .wait(400)
            .screenshot();

        exec(`xdg-open ${screenshot} &`, (err, stdout, stderr) => {
            if(err) {
                console.log('failed to open screenshot');
            }
        });
    }
};
