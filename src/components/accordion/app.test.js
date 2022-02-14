import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';
import fetchMock from 'fetch-mock';

import maestroFixtures from 'maestro|fixtures';

import {App} from './app';

maestroFixtures.addRuntimeFixture({
    name: 'widget-financial-history-config-fixtures',
    description: 'Maestro Runtime Config',
    mocks: {
        withExperiences: {
            config: {
                experiences: {
                    billingAndPaymentOverview: {
                        contentPath: 'portal/accounts/pages_mainMenu/billingpaymentlink/currentbill'
                    },
                    accountOverview: {
                        contentPath: 'portal/accounts/overview'
                    }
                }
            }
        }
    }
});

describe('App', () => {
    it('renders correctly', async () => {
        maestroFixtures.activateRuntimeMocks({'widget-financial-history-config-fixtures': 'withExperiences'});
        fetchMock.get(/scheduled/, []);
        fetchMock.get(
            /financialHistory/,
            {history: [], offset: 0, totalRecords: 0, recentDate: '2018-12-30', pastDate: '2018-06-30'}
        );

        const wrapper = mount(<App />);

        assert.strictEqual(
            wrapper.find('.widget-financial-history-layout .history__heading h1').text(),
            'Billing & payment history',
            'Renders the correct header'
        );
    });
});
