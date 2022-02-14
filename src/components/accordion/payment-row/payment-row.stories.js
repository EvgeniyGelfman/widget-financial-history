import React from 'react';
import forEach from 'lodash/fp/forEach';
import noop from 'lodash/fp/noop';

import {MockConfigProvider} from '@opower/maestro-react/mock';
import {waitForRedux} from '@opower/storybook-react-config/loki';
import {storiesOf} from '@storybook/react';

import maestroFixtures from 'maestro|fixtures';

import {toggleAccordionAction} from '../../actions';
import {store} from '../../store';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {PaymentRowView} from '.';

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

const activity = {
    date: '2018-10-25',
    label: 'Payment',
    type: 'P',
    amount: 80,
    currency: '$',
    currencyCode: 'USD',
    details: [],
    id: 'P-247743106',
    billId: null,
    payDetail: {
        confirmationNumber: '064563023203111',
        payEventId: '243143106623',
        paymentId: '247743106',
        tenderDetails: [
            {
                paymentType: '47',
                paymentTypeDescription: 'CREDITCARD',
                tenderAmount: 112.13,
                cardType: 'C1VS',
                cardTypeDescription: 'VISA',
                last4DigitsOfCardNumber: '3832',
                last4DigitsOfAccountNumber: null,
                last4DigitsOfRoutingNumber: null,
                bankName: null
            }
        ]
    }
};

const config = {
    formatConfig: {
        numberOfDecimalPlaces: 2
    }
};

const toggleStateActions = [
    toggleAccordionAction({entityId: 'P-247743106'})
];

const makeStory = (activity, actions) => {
    return waitForRedux(() => {
        forEach((action) => {
            store.dispatch(action);
        }, actions);

        return (
            <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})} widgetConfig={config}>
                <table>
                    <tbody>
                        <PaymentRowView
                            t={mockTranslate}
                            payment={activity}
                            key={activity.id}
                            numberOfDecimalPlaces={2}
                            toggleAccordion={noop}
                            isOpen
                        />
                    </tbody>
                </table>
            </MockConfigProvider>
        );

    });
};

storiesOf('Payment', module)
    .lokiAsync('PaymentRow', makeStory(activity, toggleStateActions));
