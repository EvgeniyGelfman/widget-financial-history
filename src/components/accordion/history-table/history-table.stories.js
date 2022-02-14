import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {Provider as ReduxProvider} from 'react-redux';
import {store} from '@opower/widget-store';
import {storiesOf} from '@storybook/react';

import maestroFixtures from 'maestro|fixtures';

import i18n from '@opower/i18next-config';
import {MockConfigProvider} from '@opower/maestro-react/mock';
import {changeSelectedAccount} from '@opower/account-namespace/actions';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {toggleAccordionAction} from '../../actions';
import {HistoryTableView} from './history-table';

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
                    }
                }
            }
        }
    }
});

const defaultHistory = [{
    date: '2018-11-05',
    label: 'Bill',
    type: 'C',
    amount: 111.6,
    currency: '$',
    currencyCode: 'USD',
    billDetails: [],
    payDetail: null,
    id: '0',
    billId: 1
}, {
    date: '2018-10-25',
    label: 'Payment',
    type: 'P',
    amount: 80,
    currency: '$',
    currencyCode: 'USD',
    id: '1',
    payDetail: {
        confirmationNumber: '17756232103444',
        payEventId: '123143106623',
        paymentId: '223100106',
        tenderDetails: [
            {
                tenderType: 'APSV',
                tenderTypeDescription: 'Credit card',
                paymentType: '47',
                paymentTypeDescription: 'CREDITCARD',
                tenderAmount: 33.3,
                cardType: 'C1VS',
                cardTypeDescription: 'VISA',
                last4DigitsOfCardNumber: '3832',
                last4DigitsOfAccountNumber: null,
                last4DigitsOfRoutingNumber: null,
                bankName: null
            }
        ]
    }
}, {
    date: '2018-10-05',
    label: 'Bill',
    type: 'C',
    amount: 80,
    currency: '$',
    currencyCode: 'USD',
    billDetails: [],
    payDetail: null,
    id: '2',
    billId: 3
}];

const defaultScheduledPayments = [
    {
        accountPayments: [
            {
                accountId: '05-ACCOUNT-ID',
                paymentAmount: 120
            }
        ],
        paymentId: '0',
        scheduledDate: '2017-04-26',
        totalAmount: 120,
        status: 'SCHEDULED',
        description: 'Checking Account XXXX'
    }
];

const config = {
    formatConfig: {
        numberOfDecimalPlaces: 2
    }
};

const actions = [
    toggleAccordionAction({entityId: undefined}),
    toggleAccordionAction({entityId: '0'}),
    toggleAccordionAction({entityId: '1'}),
    toggleAccordionAction({entityId: '2'})
];

const makeStory = (history, scheduledPayments, shouldShowNoFilteredData = false) => {
    return () => {
        maestroFixtures.activateRuntimeMocks({'config-fixture': 'withExperiences'});
        store.dispatch(changeSelectedAccount({id: '00-ACCOUNT-ID', permissions: ['*/*']}));

        actions.forEach((action) => {
            store.dispatch(action);
        });

        return (
            <ReduxProvider store={store}>
                <I18nextProvider i18n={i18n} defaultNS="widget-financial-history">
                    <MockConfigProvider
                        getExperienceLink={() => ({url: '/xyz', target: '_self'})}
                        widgetConfig={config}
                    >
                        <div className="widget-financial-history-root">
                            <HistoryTableView
                                history={history}
                                t={mockTranslate}
                                scheduledPayments={scheduledPayments}
                                shouldShowPagination={false}
                                isFetching={false}
                                shouldShowNoFilteredData={shouldShowNoFilteredData}
                                visible
                            />
                        </div>
                    </MockConfigProvider>
                </I18nextProvider>
            </ReduxProvider>
        );
    };
};

storiesOf('HistoryTable', module)
    .add('Default', makeStory(defaultHistory, []))
    .add('Scheduled Payments', makeStory([], defaultScheduledPayments))
    .add('Scheduled Payments And History', makeStory(defaultHistory, defaultScheduledPayments))
    .add('Empty history', makeStory([], [], true));
