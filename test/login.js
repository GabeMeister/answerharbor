import {test} from 'ava';
import Chromeless from 'chromeless';
import 'jquery';


test('login works', async t => {
    const chromeless = new Chromeless({
        launchChrome: false,
        scrollBeforeClick: true
    });

    await chromeless
        .goto('http://localhost:5000/')
        .clearCache();


    let screen1 = await chromeless
        .wait(400)
        .screenshot();
    t.log(screen1);


    let needToLogout = await chromeless
        .exists('a[href="/logout"]');
    if(needToLogout) {
        t.log('about to click logout');
        await chromeless
            .click('a[href="/logout"]');
    }


    let screen2 = await chromeless
        .wait(400)
        .screenshot();
    t.log(screen2);


    await chromeless
        .click('a[href="/login"]')
        .type('fake1', 'input[name="username"')
        .type('12341234', 'input[name="password"]')
        .click('input[name="submit"]')
        .wait(400);

    // Check for the /logout link to figure out if we're signed in
    const success = await chromeless
        .exists('a[href="/logout"]');

    if(success) {
        await chromeless
            .click('a[href="/logout"]')
            .wait(400);
    }

    await chromeless.end();

    t.true(success);
});
