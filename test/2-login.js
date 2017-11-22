const { test } = require('ava');
const $ = require('jquery');
const ci = require('./helpers/ci');
const sqlite3 = require('sqlite3');
const { exec } = require('child_process');


test.serial('sign up works', async t => {
    const chromeless = ci.createChromeless();

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
        .click('a[href="/signup"]')
        .type('FakeTestUsername', 'input[name="username"]')
        .type('faketestusername@gmail.com', 'input[name="email"]')
        .type('12341234', 'input[name="password"]')
        .type('12341234', 'input[name="confirm_password"]')
        .click('input[name="submit"]')
        .wait(400);

    // Check for "Welcome, FakeTestUsername" in nav bar
    let welcomeText = await chromeless
        .evaluate(async () => {
            return $('p.navbar-text').text();
        });
    t.is(welcomeText, 'Welcome, FakeTestUsername');

    // Check for the /logout link to figure out if we're signed up
    let success = await chromeless
        .exists('a[href="/logout"]');
    t.true(success);

    if(success) {
        await chromeless
            .click('a[href="/logout"]')
            .wait(400);
    }

    await chromeless.end();
});


test.serial('login works', async t => {
    const chromeless = ci.createChromeless();

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
        .type('FakeTestUsername', 'input[name="username"]')
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


test.serial('delete fake test user', t => {
    let db = new sqlite3.Database('./answerharbor_app/answerharbor.db', err => {
        if(err) {
            console.log('epic fail');
            console.log(err);
        }
    });

    db.run('DELETE FROM user WHERE username=?', 'FakeTestUsername', function(err) {
        if(err) {
            throw err;
        }

        console.log(`Row(s) deleted ${this.changes}`);
    });

    db.close();

    t.true(true);
});
