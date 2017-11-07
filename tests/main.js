const { Chromeless } = require('chromeless');
const { expect } = require('chai');

describe('Navigating Website', function() {
    let chromeless;

    before(function() {
        chromeless = new Chromeless({
            debug: true
        });
    });


    it('Can view posts', async function() {
        this.timeout(10000);

        await chromeless.goto('https://answerharbor.com')
            .click('a[href="/select_school"]')
            .click('a[href="/school/1657"]')
            .click('a[href="/course/2"]')
            .click('a[href="/homework/5"]')
            .wait(400);

        const result = await chromeless.exists('a[href*="/post/"]');
        expect(result).to.be.true;
    });


    it('Can view schools', async function() {
        this.timeout(10000);

        await chromeless.goto('https://answerharbor.com')
            .click('a[href="/select_school"]')
            // .click('a[href="/school/1657"]')
            // .click('a[href="/course/2"]')
            .wait(400);

        const result = await chromeless.exists('a[href*="/school/"]');
        expect(result).to.be.true;
    });


    after(async function() {
        await chromeless.end();
    });
});
