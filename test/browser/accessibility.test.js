import ava from 'ava';
import filter from 'lodash/fp/filter';

import opowerBrowserTest from '@opower/browser-test/ava';

const browserTest = opowerBrowserTest(ava);

browserTest('accessibility', async t => {
    const {driver, accessibility, webdriver: {until, By}} = t.context;
    const maxWait = 5000;

    await driver.get({fixtures: true});
    await driver.wait(until.elementLocated(By.css('.widget-financial-history-layout .history__table'), maxWait));

    const accessibilityViolations = await accessibility.getViolations();

    // TODO: another buggy class with invalid color contrast in test theme: has-icon ($primaryColor should be 5% darken)
    // Once the color is changed, we should NOT filter out the violation
    t.deepEqual(
        filterAcceptableViolations(accessibilityViolations),
        [],
        'has no accessibility violations'
    );
});

const filterAcceptableViolations = (violations) => {

    return filter(
        violation => violation.id !== 'color-contrast',
        violations
    );
};
