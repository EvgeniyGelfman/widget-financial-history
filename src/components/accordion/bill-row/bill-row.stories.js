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

import {BillRowView} from '.';

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
    date: '2018-11-05',
    label: 'Bill',
    type: 'C',
    amount: 111.6,
    currency: '$',
    currencyCode: 'USD',
    id: '0',
    billId: 1,
    billDetails: [{
        label: 'Gas Service',
        amount: 41.3,
        currency: '$'
    }, {
        label: 'Adjustment',
        amount: -50.0,
        currency: '$'
    }]
};

const toggleStateActions = [
    toggleAccordionAction({entityId: 'P-247743106'})
];

const makeStory = (activity, isOpen, actions) => {
    return waitForRedux(() => {
        forEach((action) => {
            store.dispatch(action);
        }, actions);

        return (
            <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
                <table>
                    <tbody>
                        <BillRowView
                            t={mockTranslate}
                            isOpen={isOpen}
                            key={activity.id}
                            bill={activity}
                            numberOfDecimalPlaces={2}
                            toggleAccordion={noop}
                        />
                    </tbody>
                </table>
            </MockConfigProvider>
        );

    });
};

storiesOf('Bill', module)
    .lokiAsync('BillRow', makeStory(activity, true, toggleStateActions));
