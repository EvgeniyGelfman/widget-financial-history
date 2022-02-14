import React from 'react';
import {waitForIcons} from '@opower/react-iconic/loki';
import noop from 'lodash/fp/noop';

import {storiesOf} from '@storybook/react';

import maestroFixtures from 'maestro|fixtures';

import {selectDateFilterAction, toggleAccordionAction} from '../actions';
import {store} from '../store';

import {App} from './app';
import {queries as accountNamespace} from '@opower/account-namespace';
import {queries as paymentsNamespace} from '@opower/payments-namespace';
import {getState} from '../namespace';
import {queryFirstTimeError, queryIsPaginatorFetchSuccessful} from '../queries';

const historyRequestSucceeded = (globalState) => {
    const widgetState = getState(globalState);

    return queryIsPaginatorFetchSuccessful(widgetState);
};

const accountRequestSucceeded = (globalState) => {
    return accountNamespace.selectedAccount.isSuccess(globalState);
};

const scheduledPaymentsReceived = (globalState) => {
    const payments = paymentsNamespace.queryScheduledPayments(getState(globalState));

    return payments.length > 0;
};

const allRequestsSucceeded = (globalState) => {
    return historyRequestSucceeded(globalState)
        && accountRequestSucceeded(globalState)
        && scheduledPaymentsReceived(globalState);
};

const waitForReduxConditions = (storyFn, testRedux, shouldWaitForIcons) => {
    return ({done}) => {
        const unsubscribe = store.subscribe(() => {
            const globalState = store.getState();

            if (testRedux(globalState)) {
                unsubscribe();
                if (shouldWaitForIcons) {
                    waitForIcons(noop)({done});
                } else {
                    done();
                }
            }
        });

        return storyFn();
    };
};

const makeStoryWithFixtures =
    ({historyFixture, scheduledPaymentsFixture, accountFixture, runtimeFixture}, actions, testRedux) => {
        return waitForReduxConditions(() => {
            maestroFixtures.activateMock('cws-financial-history-v1', historyFixture);
            maestroFixtures.activateMock('cws-scheduled-payments-v1', scheduledPaymentsFixture);
            maestroFixtures.activateMock('account-namespace-account', accountFixture || 'account-holder');
            if (runtimeFixture) {
                maestroFixtures.activateRuntimeMocks(
                    {'widget-financial-history-config-fixtures': runtimeFixture}
                );
            }

            const unsubscribe = store.subscribe(() => {
                const globalState = store.getState();

                if (accountRequestSucceeded(globalState)) {
                    unsubscribe();
                    actions.forEach((action) => {
                        store.dispatch(action);
                    });
                }
            });

            return <App />;
        }, testRedux);
    };

const toggleBillStateActions = [
    toggleAccordionAction({entityId: 'B-12274411215'})
];
const togglePaymentStateActions = [
    toggleAccordionAction({entityId: 'P-223100106'})
];
const selectDateFilterActionThisYear = [
    selectDateFilterAction({selectedOption: 'THIS_YEAR_DATES'})
];
const selectDateFilterActionLastYear = [
    selectDateFilterAction({selectedOption: 'LAST_YEAR_DATES'})
];

storiesOf('Widget', module)
    .lokiAsync(
        'Default',
        makeStoryWithFixtures({
            historyFixture: 'happy-path',
            scheduledPaymentsFixture: 'scheduled-payments-single-account',
            runtimeFixture: 'withExperiences'
        }, [], allRequestsSucceeded, true)
    )
    .lokiAsync(
        'Open Bill Accordion',
        makeStoryWithFixtures(
            {
                historyFixture: 'happy-path',
                scheduledPaymentsFixture: 'scheduled-payments-single-account',
                runtimeFixture: 'withExperiences'
            },
            toggleBillStateActions,
            allRequestsSucceeded, true
        )
    )
    .lokiAsync(
        'Open Payment Accordion',
        makeStoryWithFixtures(
            {
                historyFixture: 'happy-path',
                scheduledPaymentsFixture: 'scheduled-payments-single-account',
                runtimeFixture: 'withExperiences'
            },
            togglePaymentStateActions,
            allRequestsSucceeded, true
        )
    )
    .lokiAsync(
        'Payment Scheduled',
        makeStoryWithFixtures({
            historyFixture: 'no-data',
            scheduledPaymentsFixture: 'scheduled-payments-single-account',
            runtimeFixture: 'withExperiences'
        }, [], allRequestsSucceeded, true)
    )
    .lokiAsync('Payments Scheduled - multi-account payment', makeStoryWithFixtures({
        historyFixture: 'no-data',
        scheduledPaymentsFixture: 'scheduled-payments-multi-account',
        runtimeFixture: 'withExperiences'
    }, [toggleAccordionAction({entityId: '08349392681531'})], allRequestsSucceeded, true))
    .lokiAsync('Payments Scheduled - multi-account payment no-permissions', makeStoryWithFixtures({
        historyFixture: 'no-data',
        scheduledPaymentsFixture: 'scheduled-payments-multi-account',
        accountFixture: 'error-no-permissions',
        runtimeFixture: 'withExperiences'
    }, [toggleAccordionAction({entityId: '08349392681531'})], allRequestsSucceeded, true))
    .lokiAsync(
        'No Data',
        makeStoryWithFixtures({
            historyFixture: 'no-data',
            scheduledPaymentsFixture: 'scheduled-payments-none',
            runtimeFixture: 'withExperiences'
        }, [], (globalState) => historyRequestSucceeded(globalState))
    )
    .lokiAsync(
        'Date Filter This Year',
        makeStoryWithFixtures(
            {
                historyFixture: 'happy-path',
                scheduledPaymentsFixture: 'scheduled-payments-single-account',
                runtimeFixture: 'withExperiences'
            },
            selectDateFilterActionThisYear,
            allRequestsSucceeded, true
        )
    )
    .lokiAsync(
        'Date Filter Last Year',
        makeStoryWithFixtures(
            {
                historyFixture: 'happy-path',
                scheduledPaymentsFixture: 'scheduled-payments-single-account',
                runtimeFixture: 'withExperiences'
            },
            selectDateFilterActionLastYear,
            allRequestsSucceeded, true
        )
    )
    .lokiAsync(
        'With Pagination',
        makeStoryWithFixtures({
            historyFixture: 'paginated-response',
            scheduledPaymentsFixture: 'scheduled-payments-single-account',
            runtimeFixture: 'with-pagination'
        }, [], allRequestsSucceeded, true)
    )
    .lokiAsync(
        'Error screen',
        makeStoryWithFixtures({
            historyFixture: 'error-response',
            scheduledPaymentsFixture: 'scheduled-payments-single-account',
            runtimeFixture: 'withExperiences'
        }, [], (globalState) => {
            const error = queryFirstTimeError(getState(globalState));

            return !!error;
        }, true)
    );
