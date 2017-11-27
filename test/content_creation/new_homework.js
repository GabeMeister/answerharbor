const { test } = require('ava');
const { Chromeless } = require('chromeless');
const ci = require('../helpers/ci');
const config = require('../helpers/config');
const $ = require('jquery');

// TODO: check for title as well
test('create new homework', async t => {
    const chromeless = ci.createChromeless();
    await chromeless
        .goto('http://localhost:5000/ci_login/'+config.CI_LOGIN_PASSHASH)
        .click('a[href="/select_school"]')
        .click('a[href="/school/1657"]')
        .click('a[href="/course/2"]')
        .click('a[href="/newhomework?course_id=2"]')
        .type('Test Homework', '#title')
        .type('2017/11/29 23:00', '#due_date')
        .click('input[type="submit"]');

    let title = await chromeless.evaluate(() => {
        return $(".card-link-text:contains('Test Homework')").text().trim();
    });
    t.is(title, 'Test Homework2');

    let dueDate = await chromeless.evaluate(() => {
        return $(".card-link-date:contains('Due: Wed, Nov 29, 2017 at 11:00 PM')").text().trim();
    });
    t.is(dueDate, 'Due: Wed, Nov 29, 2017 at 11:00 PM');

    await chromeless.end();
});
