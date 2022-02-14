import ava from 'ava';
import includes from 'lodash/fp/includes';

import opowerBrowserTest from '@opower/browser-test/ava';
import {compareFormattedAmounts} from '../lib/compare-formatted-amounts';

const browserTest = opowerBrowserTest(ava);
const maxWait = 5000;

browserTest('should render the correct data for different views in date filter', async (t) => {
    const {driver, webdriver} = t.context;
    const {By, until} = webdriver;

    await driver.get({
        fixtures: {
            maestro: {
                'cws-financial-history-v1': 'happy-path',
                'cws-scheduled-payments-v1': 'scheduled-payments-single-account'
            }
        }
    });

    await driver.wait(until.elementLocated(By.css('.widget-financial-history-container')), maxWait);
    await driver.wait(until.elementLocated(By.css('.custom-select')), maxWait);

    const dateActivityAllDatesViewCss = '.history__table .activity:nth-child(1) .activity-date';

    await driver.wait(until.elementLocated(By.css(dateActivityAllDatesViewCss)));

    const latestDateAllDatesView = await driver.$(dateActivityAllDatesViewCss).getText();

    t.true(
        includes('2019', latestDateAllDatesView),
        'includes 2019 in all dates view'
    );

    t.is(
        await driver.$('.history__table .activity-description').getText(),
        'Scheduled payment',
        'renders scheduled payments in all dates view'
    );

    await driver.wait(until.elementLocated(By.css('.history__table .activity-amount')));

    const totalAmounts = await driver.$$('.history__table .activity-amount');

    t.true(
        compareFormattedAmounts(await totalAmounts[0].getText(), '1.56'),
        'renders correct scheduled payment amount in all dates view'
    );

    const scheduledActivityDescriptionCss = '.history__table .activity-description';

    await driver.wait(until.elementLocated(By.css(scheduledActivityDescriptionCss)));

    t.is(
        await driver.$(scheduledActivityDescriptionCss).getText(),
        'Scheduled payment',
        'renders scheduled payments in all dates view'
    );

    t.truthy(
        await driver.$('#P-223100106 .activity-amount'),
        'the class that controls the color for payments is loaded'
    );

    const dateFilter = await driver.$$('.custom-select.date-filter-container > select option');

    await dateFilter[2].click();

    const totalAmountLastYearViewCss = '.history__table .activity-amount';

    await driver.wait(until.elementLocated(By.css(totalAmountLastYearViewCss)));

    const totalLastYearViews = await driver.$$(totalAmountLastYearViewCss);

    t.true(
        compareFormattedAmounts(await totalLastYearViews[0].getText(), '33.30'),
        'renders correct bill amount when changed to last year view'
    );

    const dateActivityCss = '.history__table .activity:nth-child(1) .activity-date';

    await driver.wait(until.elementLocated(By.css(dateActivityCss)));

    const latestDateinTheLastYearView = await driver.$(dateActivityCss).getText();

    t.false(
        includes('2019', latestDateinTheLastYearView),
        'does not include 2019 in the last year view'
    );

    await driver.wait(until.elementLocated(By.css('.history__table .activity-description')));

    t.not(
        await driver.$('.history__table .activity-description').getText(),
        'Scheduled payment',
        'does not renders scheduled payments in last year view'
    );

    await dateFilter[1].click();
    await driver.wait(until.elementLocated(By.css('.history__table .activity-description')));

    t.is(
        await driver.$('.history__table .activity-description').getText(),
        'Scheduled payment',
        'renders scheduled payments in this year view'
    );
});
