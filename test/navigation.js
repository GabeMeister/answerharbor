const { Chromeless } = require('chromeless');
const { expect } = require('chai');

describe('Navigating Website', function() {
    var chromeless;

    before(function() {
        chromeless = new Chromeless({
            debug: true
        });
    });

    it('can view posts', async function() {
        this.timeout(10000);

        await chromeless.goto('http://localhost:5000')
            .click('a[href="/select_school"]')
            .click('a[href="/school/1657"]')
            .click('a[href="/course/2"]')
            .click('a[href="/homework/5"]')
            .wait(400);

        const result = await chromeless.exists('a[href*="/post/"]');
        expect(result).to.be.true;
    });

    after(async function() {
        // await chromeless.end();
    });
});
