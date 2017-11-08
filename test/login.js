const { Chromeless } = require('chromeless');
const { expect } = require('chai');

describe('Logins', function() {
    var chromeless;

    before(function() {
        chromeless = new Chromeless({
            debug: true
        });
    });

    it('can view homeworks', async function() {
        this.timeout(10000);

        await chromeless.goto('http://localhost:5000')
            .click('a[href="/select_school"]')
            .click('a[href="/school/1657"]')
            .click('a[href="/course/2"]')
            .wait(400);

        const result = await chromeless.exists('a[href*="/school/"]');
        expect(result).to.be.true;
    });

    after(async function() {
        // await chromeless.end();
    });
});
