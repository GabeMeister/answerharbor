import {test} from 'ava';
import Chromeless from 'chromeless';

test('posts exist', async t => {
    const chromeless = new Chromeless({ launchChrome: false });
    await chromeless
        .goto('http://localhost:5000')
        .click('a[href="/select_school"]')
        .click('a[href="/school/1657"]')
        .click('a[href="/course/2"]')
        .click('a[href="/homework/5"]')
        .wait(400);

    const result = await chromeless.exists('a[href*="/post/"]');
    await chromeless.end();

    t.true(result);
});


test('homeworks exist', async t => {
    const chromeless = new Chromeless({ launchChrome: false });
    await chromeless
        .goto('http://localhost:5000')
        .click('a[href="/select_school"]')
        .click('a[href="/school/1657"]')
        .click('a[href="/course/2"]')
        .wait(400);

    const result = await chromeless.exists('a[href*="/homework/"]');
    await chromeless.end();

    t.true(result);
});


test('courses exist', async t => {
    const chromeless = new Chromeless({ launchChrome: false });
    await chromeless
        .goto('http://localhost:5000')
        .click('a[href="/select_school"]')
        .click('a[href="/school/1657"]')
        .wait(400);

    const result = await chromeless.exists('a[href*="/course/"]');
    await chromeless.end();

    t.true(result);
});


test('schools exist', async t => {
    const chromeless = new Chromeless({ launchChrome: false });
    await chromeless
        .goto('http://localhost:5000')
        .click('a[href="/select_school"]')
        .wait(400);

    const result = await chromeless.exists('a[href*="/school/"]');
    await chromeless.end();

    t.true(result);
});
