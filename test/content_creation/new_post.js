const { test } = require('ava');
const { Chromeless } = require('chromeless');
const ci = require('../helpers/ci');
const config = require('../helpers/config');
const $ = require('jquery');

// TODO: check for title as well
test.only('create new post', async t => {
    const chromeless = ci.createChromeless();
    await chromeless
        .goto('http://localhost:5000/ci_login/'+config.CI_LOGIN_PASSHASH)
        .click('a[href="/select_school"]')
        .click('a[href="/school/1657"]')
        .click('a[href="/course/2"]')
        .click('a[href="/homework/5"]')
        .click('a[href="/newpost?homework_id=5"]')
        .type('Test Question', '#question_input')
        .press(37)
        .type('Test Step', '#step_1_input')
        .press(37)
        .type('Test Final Answer', '#final_answer_input')
        .press(37)
        .click('input[type="submit"]')
        .wait(2000);

    let question = await chromeless.evaluate(() => {
        return $('#question_preview').text().trim();
    });
    t.is(question, 'Test Question');

    let step1 = await chromeless.evaluate(() => {
        return $('#step_1_preview').text().trim();
    });
    t.is(step1, 'Test Step');

    let finalAnswer = await chromeless.evaluate(() => {
        return $('#answer_1_preview').text().trim();
    });
    t.is(finalAnswer, 'Test Final Answer');

    await chromeless.end();
});
