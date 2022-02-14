import ava from 'ava';

import opowerBrowserTest from '@opower/browser-test/ava';
import {compareFormattedAmounts} from '../lib/compare-formatted-amounts';

const browserTest = opowerBrowserTest(ava);
const maxWait = 5000;

browserTest('Basic content shows up on page', async t => {
    const {driver, webdriver: {until, By}} = t.context;

    await driver.get({fixtures: true});

    await driver.wait(until.elementLocated(By.css('.widget-financial-history-container')), maxWait);

    await driver.wait(until.elementLocated(By.css('.widget-financial-history-layout > .history__heading'), maxWait));

    t.is(
        await driver.$('.widget-financial-history-layout > .history__heading').getText(),
        'Billing & payment history',
        'Initial content is correct'
    );
});

browserTest('should render content when history exists', async (t) => {
    const {driver, webdriver} = t.context;
    const {By, until} = webdriver;

    await driver.get({
        fixtures: {
            maestro: {
                'cws-financial-history-v1': 'happy-path',
                'cws-scheduled-payments-v1': 'scheduled-payments-none'
            }
        }
    });

    const activityAmount  = '.history__table .activity-amount';

    await driver.wait(until.elementLocated(By.css(activityAmount)));

    const amounts = await driver.$$(activityAmount);
    const totalBill = await amounts[1].getText();

    t.true(
        compareFormattedAmounts(totalBill, '8.70'),
        'renders correct bill total'
    );

    const activityDateCss = '.history__table .activity-date';

    await driver.wait(until.elementLocated(By.css(activityDateCss)));

    const dates = await driver.$$(activityDateCss);
    const activityDate = await dates[1].getText();

    t.is(
        activityDate,
        'Oct 15, 2018',
        'renders correct date for record'
    );

    const activityDescriptionCss = '.history__table .activity-description';

    await driver.wait(until.elementLocated(By.css(activityDescriptionCss)));

    const descriptions = await driver.$$(activityDescriptionCss);
    const activityDescription = await descriptions[1].getText();

    t.is(
        activityDescription,
        'Bill Posted',
        'renders correct activity description'
    );
});

browserTest('should render content when scheduled payment exists', async (t) => {
    const {driver, webdriver} = t.context;
    const {By, until} = webdriver;

    await driver.get({
        fixtures: {
            maestro: {
                'cws-financial-history-v1': 'no-data',
                'cws-scheduled-payments-v1': 'scheduled-payments-single-account'
            }
        }
    });

    const activityAmount  = '.history__table .activity-amount';

    await driver.wait(until.elementLocated(By.css(activityAmount)));

    const totalBill = await driver.$(activityAmount).getText();

    t.true(
        compareFormattedAmounts(totalBill, '1.56'),
        'renders correct bill total'
    );

    const activityDateCss = '.history__table .activity-date';

    await driver.wait(until.elementLocated(By.css(activityDateCss)));

    const activityDate = await driver.$(activityDateCss).getText();

    t.is(
        activityDate,
        'Sep 25, 2019',
        'renders correct date for record'
    );

    const activityDescriptionCss = '.history__table .activity-description';

    await driver.wait(until.elementLocated(By.css(activityDescriptionCss)));

    const activityDescription = await driver.$(activityDescriptionCss).getText();

    t.is(
        activityDescription,
        'Scheduled payment',
        'renders correct activity description'
    );
});

browserTest('should render content when both history and scheduled payment exists', async (t) => {
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

    const scheduledAmountCss  = '.history__table .activity-amount';

    await driver.wait(until.elementLocated(By.css(scheduledAmountCss)));

    const totalBillScheduled = await driver.$(scheduledAmountCss).getText();

    t.true(
        compareFormattedAmounts(totalBillScheduled, '1.56'),
        'renders correct bill total'
    );

    const scheduledActivityDateCss = '.history__table .activity-date';

    await driver.wait(until.elementLocated(By.css(scheduledActivityDateCss)));

    const scheduledActivityDate = await driver.$(scheduledActivityDateCss).getText();

    t.is(
        scheduledActivityDate,
        'Sep 25, 2019',
        'renders correct date for record'
    );

    const scheduledActivityDescriptionCss = '.history__table .activity-description';

    await driver.wait(until.elementLocated(By.css(scheduledActivityDescriptionCss)));

    const scheduledActivityDescription = await driver.$(scheduledActivityDescriptionCss).getText();

    t.is(
        scheduledActivityDescription,
        'Scheduled payment',
        'renders correct activity description'
    );

    const historyAmountCss  = '.history__table .activity:nth-child(5) .activity-amount';

    await driver.wait(until.elementLocated(By.css(historyAmountCss)));

    const totalBillHistory = await driver.$(historyAmountCss).getText();

    t.true(
        compareFormattedAmounts(totalBillHistory, '8.70'),
        'renders correct bill total'
    );

    const historyActivityDateCss = '.history__table .activity:nth-child(5) .activity-date';

    await driver.wait(until.elementLocated(By.css(historyActivityDateCss)));

    const historyActivityDate = await driver.$(historyActivityDateCss).getText();

    t.is(
        historyActivityDate,
        'Oct 15, 2018',
        'renders correct date for record'
    );

    const historyActivityDescriptionCss = '.history__table .activity:nth-child(5) .activity-description';

    await driver.wait(until.elementLocated(By.css(historyActivityDescriptionCss)));

    const historyActivityDescription = await driver.$(historyActivityDescriptionCss).getText();

    t.is(
        historyActivityDescription,
        'Bill Posted',
        'renders correct activity description'
    );
});

browserTest('should render correct aria-label value', async (t) => {
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

    const selector = '.custom-select.date-filter-container > select';

    await driver.wait(until.elementLocated(By.css(selector)));

    const ariaLabel = await driver.$(selector).getAttribute('aria-label');

    t.is(
        ariaLabel,
        'Select a date range',
        'renders correct text'
    );

    const selectorTransaction = '.custom-select.transaction-filter-container > select';

    await driver.wait(until.elementLocated(By.css(selectorTransaction)));

    const ariaLabelTransaction = await driver.$(selectorTransaction).getAttribute('aria-label');

    t.is(
        ariaLabelTransaction,
        'Select transactions',
        'renders correct text'
    );
});

browserTest('should render correctly with pagination', async (t) => {
    const {driver, webdriver} = t.context;
    const {By, until} = webdriver;
    const selectors = {
        prevButton: '.pagination-button.back',
        nextButton: '.pagination-button.next',
        progress: '.pagination-progress',
        payment: '#P-2431456106',
        bill: '#B-122734411215'
    };

    await driver.get({
        fixtures: {
            maestro: {
                'cws-financial-history-v1': 'paginated-response'
            },
            maestroRuntime: {
                'widget-financial-history-config-fixtures': 'with-pagination'
            }
        }
    });

    await driver.wait(until.elementLocated(By.css(selectors.progress)));

    t.is(
        await driver.$(selectors.progress).getText(),
        'Page 1 of 2',
        'renders correct page number and total pages in the beginning'
    );

    // Check Aria labels
    t.is(
        await driver.$(selectors.prevButton).getAttribute('aria-label'),
        'Go to previous page',
        'renders correct aria-label for previous-button'
    );

    t.is(
        await driver.$(selectors.nextButton).getAttribute('aria-label'),
        'Go to next page',
        'renders correct aria-label for next-button'
    );

    // Check if pagination is rendering the page number correctly when next and previous buttons are clicked.
    await driver.$(selectors.nextButton).click();

    // NOTE: After clicking next-button, widget will open page 2 and start fetching - buttons are disabled during fetch.
    // Wait until data is received by checking if the prev-button is enabled
    await driver.wait(until.elementIsEnabled(driver.$(selectors.prevButton)));

    t.is(
        await driver.$(selectors.progress).getText(),
        'Page 2 of 2',
        'renders correct page number after clicking next-button'
    );

    t.truthy(
        await driver.$(selectors.bill),
        'Page 2 should have a Bill with ID: ' + selectors.bill
    );

    await driver.$(selectors.prevButton).click();

    t.is(
        await driver.$(selectors.progress).getText(),
        'Page 1 of 2',
        'renders correct page number after clicking previous-button'
    );

    t.truthy(
        await driver.$(selectors.payment),
        'Page 1 should have a Payment with ID: P-2431456106'
    );
});

browserTest('should render correctly with 2nd page error in pagination', async (t) => {
    const {driver, webdriver} = t.context;
    const {By, until} = webdriver;
    const selectors = {
        nextButton: '.pagination-button.next',
        progress: '.pagination-progress',
        errorHeading: '.loading-error__heading',
        errorSubHeading: '.loading-error__subheading'
    };

    await driver.get({
        fixtures: {
            maestro: {
                'cws-financial-history-v1': 'pagination-with-second-page-in-error'
            },
            maestroRuntime: {
                'widget-financial-history-config-fixtures': 'with-pagination'
            }
        }
    });

    await driver.wait(until.elementLocated(By.css(selectors.progress)));
    await driver.$(selectors.nextButton).click();
    await driver.wait(until.elementLocated(By.css(selectors.errorHeading)));
    await driver.wait(until.elementIsVisible(driver.$(selectors.errorHeading)));

    t.is(
        await driver.$(selectors.errorHeading).getText(),
        'We\'re sorry, but something went wrong.',
        'renders correct error heading'
    );

    t.is(
        await driver.$(selectors.errorSubHeading).getText(),
        'We\'re unable to retrieve your information right now.',
        'renders correct error sub-heading'
    );
});

browserTest('should render content with multiple payment methods', async (t) => {
    const {driver, webdriver} = t.context;
    const {By, until} = webdriver;

    await driver.get({
        fixtures: {
            maestro: {
                'cws-financial-history-v1': 'multiple-payment-methods',
                'cws-scheduled-payments-v1': 'scheduled-payments-none'
            }
        }
    });

    const activityDescriptionCss = '.history__table .activity-description span';

    await driver.wait(until.elementLocated(By.css(activityDescriptionCss)));

    const descriptions = await driver.$$(activityDescriptionCss);

    await descriptions[0].click();

    const paymentDetailsCss = '.details-row__value';

    await driver.wait(until.elementLocated(By.css(paymentDetailsCss)));

    const details = await driver.$$(paymentDetailsCss);
    const paymentMethods = await details[0].findElements(By.css('p'));

    t.is(
        await paymentMethods[0].getText(),
        'Savings account ending in 2142',
        'renders payment description'
    );

    t.is(
        await paymentMethods[1].getText(),
        'Checking - Auto Pay - CSS',
        'renders tenders description'
    );
});
