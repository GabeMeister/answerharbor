import {test} from 'ava';
import Chromeless from 'chromeless';
import 'jquery';
var ci = require('./helpers/ci');


test('login works', async t => {
    const chromeless = new Chromeless({
        launchChrome: false,
        scrollBeforeClick: true
    });

    await chromeless
        .goto('http://localhost:5000/')
        .clearCache();

    // Ensure we are already logged out
    let needToLogout = await chromeless
        .exists('a[href="/logout"]');
    if(needToLogout) {
        await chromeless
            .click('a[href="/logout"]');
    }

    await chromeless
        .click('a[href="/login"]')
        .type('fake1', 'input[name="username"')
        .type('12341234', 'input[name="password"]')
        .click('input[name="submit"]')
        .wait(400);

    // Check for the /logout link to figure out if we're signed in
    let success = await chromeless
        .exists('a[href="/logout"]');
    if(success) {
        await chromeless
            .click('a[href="/logout"]')
            .wait(400);
    }

    await chromeless.end();

    t.true(success);
});
