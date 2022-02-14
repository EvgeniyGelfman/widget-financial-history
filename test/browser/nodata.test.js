import ava from 'ava';
import contains from 'lodash/fp/contains';

import opowerBrowserTest from '@opower/browser-test/ava';

const browserTest = opowerBrowserTest(ava);

browserTest('should render appropriate message when no history exists', async (t) => {
    const {driver, webdriver} = t.context;
    const {By, until} = webdriver;

    await driver.get({
        fixtures: {
            maestro: {
                'cws-financial-history-v1': 'no-data',
                'cws-scheduled-payments-v1': 'scheduled-payments-none'
            },
            maestroRuntime: {
                'widget-financial-history-config-fixtures': 'withExperiences'
            }
        }
    });

    const noBillingHistoryCss  = '.no-data-container .display-smaller';

    await driver.wait(until.elementLocated(By.css(noBillingHistoryCss)));

    const noBill = await driver.$(noBillingHistoryCss).getText();

    t.is(
        noBill,
        'You don’t have any billing and payment history right now.',
        'renders correct message for no data'
    );

    const  firstBillReceivedMessageCss = '.no-data-container .quiet';

    await driver.wait(until.elementLocated(By.css(firstBillReceivedMessageCss)));

    const billReceived = await driver.$(firstBillReceivedMessageCss).getText();

    t.is(
        billReceived,
        'When you receive your first bill or make your first payment, you’ll see them here.',
        'renders correct message for no data'
    );

    const overviewLink = '.overview-link';

    await driver.wait(until.elementLocated(By.css(overviewLink)));
    const backButtonLink = await driver.$(overviewLink).getAttribute('href');

    t.true(
        contains('portal/accounts/home', backButtonLink),
        'renders correct link for Return To Overview button'
    );
});
