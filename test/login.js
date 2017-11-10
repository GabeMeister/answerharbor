import {test} from 'ava';
import Chromeless from 'chromeless';
import 'jquery';

test('login works', async t => {
    const chromeless = new Chromeless({
        launchChrome: false,
        // scrollBeforeClick: true,
        viewport: {
            width: 1500,
            height: 900,
            scale: 1
        }
    });

    // TODO: figure out what is going on with the login button
    let currentlySignedIn = await chromeless
        .exists('a[href="/logout"]');

    if(currentlySignedIn) {
        t.log('yup, signed in');
        await chromeless
            .click();
    }
    else {
        t.log('not signed in!');
    }

    await chromeless
        .goto('http://localhost:5000')
        .click('a[href="/login"]')
        .type('fake1', 'input[name="username"')
        .type('12341234', 'input[name="password"]')
        .click('input[name="submit"]')
        .wait(400);

    // Check for the welcome text in the nav bar
    t.log('yes');
    const result = await chromeless
        .evaluate(() => {
            return $('.navbar-text').text();
        });

    await chromeless
        .click('a[href="/logout"]')
        .wait(400);

    await chromeless.end();

    t.is(result, 'Welcome, fake1');
});
