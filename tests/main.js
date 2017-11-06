const { Chromeless } = require('chromeless');
const { expect } = require('chai');

describe('Arriving at website', function() {
    it('has call to action button', async function() {
        this.timeout(10000);
        const chromeless = new Chromeless();

        await chromeless.goto('https://answerharbor.com')
            .wait('div.body-content');

        const result = await chromeless.exists('a[href="/select_school"]');

        expect(result).to.be.true;
        await chromeless.end();
    });
});
