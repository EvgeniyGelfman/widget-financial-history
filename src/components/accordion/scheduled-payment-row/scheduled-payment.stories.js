import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import configureMockStore from 'redux-mock-store';

import noop from 'lodash/fp/noop';

import {MockConfigProvider} from '@opower/maestro-react/mock';
import {waitForRedux} from '@opower/storybook-react-config/loki';
import {name as accountNamespace} from '@opower/account-namespace';
import {storiesOf} from '@storybook/react';
import maestroFixtures from 'maestro|fixtures';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {ScheduledPaymentView} from './scheduled-payment-view';

const createMockStore = configureMockStore();
const store = createMockStore({
    [accountNamespace]: {
        selectedAccount: {
            data: {
                permissions: ['*/*']
            }
        }
    }
});

maestroFixtures.addRuntimeFixture({
    name: 'config-fixture',
    description: 'Maestro Runtime Config for component',
    mocks: {
        withExperiences: {
            config: {
                experiences: {
                    accountOverview: {
                        contentPath: 'ei/x/overview'
                    },
                    billingAndPaymentOverview: {
                        contentPath: 'ei/x/current-bill'
                    },
                    cancelScheduledPayment: {
                        contentPath: 'portal/accounts/cancelpayment'
                    }
                }
            }
        }
    }
});

const scheduledPayment = {
    id: '0',
    paymentId: 'singlePayment',
    scheduledDate: '2017-04-26',
    totalAmount: 120,
    accountPayments: [{
        accountId: 'currentAccount',
        paymentAmount: 120
    }],
    status: 'SCHEDULED',
    description: 'Payment Method'
};

const multiPayment = {
    paymentId: 'multipayment-Id',
    scheduledDate: '2017-04-26',
    totalAmount: 20070,
    status: 'SCHEDULED',
    description: 'Payment Method',
    accountPayments: [
        {accountId: 'first', paymentAmount: 40},
        {accountId: 'second', paymentAmount: 30},
        {accountId: 'third', paymentAmount: 20000}
    ]
};

const config = {
    formatConfig: {
        numberOfDecimalPlaces: 2
    }
};

const makeStory = (scheduledPayment) => {
    return waitForRedux(() => {
        return (
            <ReduxProvider store={store}>
                <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})} widgetConfig={config}>
                    <table>
                        <tbody>
                            <ScheduledPaymentView
                                t={mockTranslate}
                                scheduledPayment={scheduledPayment}
                                key={scheduledPayment.id}
                                isOpen
                                formatAmount={(t, number) => '-$' + Number(number).toFixed(2)}
                                toggleAccordion={noop}
                            />
                        </tbody>
                    </table>
                </MockConfigProvider>
            </ReduxProvider>
        );

    });
};

storiesOf('scheduledPayment', module)
    .lokiAsync('scheduledPaymentRow', makeStory(scheduledPayment))
    .lokiAsync('scheduledPaymentRow: multiPayment', makeStory(multiPayment));
