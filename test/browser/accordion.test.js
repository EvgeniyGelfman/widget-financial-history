import ava from 'ava';

import opowerBrowserTest from '@opower/browser-test/ava';

const browserTest = opowerBrowserTest(ava);
const maxWait = 5000;

browserTest('should open the bill accordion and render the sub items', async (t) => {
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

    await driver.wait(until.elementLocated(By.css('.disclosable'), maxWait));

    const accordions = await driver.$$('.disclosable');

    await accordions[4].click();

    const billSubItemsLabels = await driver.$$('#details-B-339244861115 .details-table .details-row__key');
    const billSubItemValues = await driver.$$('#details-B-339244861115 .details-table .details-row__value');

    t.is(
        await billSubItemsLabels[0].getText(),
        'Previous Balance',
        'renders the correct label for the previous balance'
    );

    t.is(
        await billSubItemValues[0].getText(),
        '$15.50',
        'renders the correct dollar amount for previous balance'
    );

    t.is(
        await billSubItemsLabels[1].getText(),
        'Gas Service',
        'renders the correct label for the service type'
    );

    t.is(
        await billSubItemValues[1].getText(),
        '$22.50',
        'renders the correct dollar amount for gas service'
    );

    t.is(
        await billSubItemsLabels[2].getText(),
        'Total Bill',
        'renders the correct label for the total bill'
    );

    t.is(
        await billSubItemValues[2].getText(),
        '$38.00',
        'renders the correct dollar amount for total bill'
    );

    const billDetailsLink = await driver.$('#details-B-339244861115 .details-table .details-link-row a');

    t.is(
        await billDetailsLink.getText(),
        'View bill details',
        'renders the link to bill details page'
    );
});

browserTest('should open the payment accordion and render the sub items', async (t) => {
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

    await driver.wait(until.elementLocated(By.css('.disclosable'), maxWait));

    const accordions = await driver.$$('.disclosable');

    await accordions[3].click();

    const paymentMethodCss = '#details-P-2431456106 .details-table .details-row__key';

    await driver.wait(until.elementLocated(By.css(paymentMethodCss)));

    const paymentLabels = await driver.$$(paymentMethodCss);
    const paymentValues = await driver.$$('#details-P-2431456106 .details-table .details-row__value');

    t.is(
        await paymentLabels[0].getText(),
        'Payment method',
        'renders correct label for the Payment method'
    );

    t.is(
        await paymentValues[0].getText(),
        'Checking account ending in 2812',
        'renders the correct value for the payment method'
    );

    t.is(
        await paymentLabels[1].getText(),
        'Confirmation #',
        'renders the correct label for the confirmation number'
    );

    t.is(
        await paymentValues[1].getText(),
        '06456232103444',
        'renders the correct value for the confirmation number'
    );
});
