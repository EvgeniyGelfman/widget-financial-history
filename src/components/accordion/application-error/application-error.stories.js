import React from 'react';

import {MockConfigProvider} from '@opower/maestro-react/mock';
import {storiesOf} from '@storybook/react';

import maestroFixtures from 'maestro|fixtures';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {ApplicationErrorView} from './application-error';

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
                    billHistory: {
                        contentPath: 'ei/x/bill-history'
                    }
                }
            }
        }
    }
});

const makeStory = () => {
    maestroFixtures.activateRuntimeMocks({'config-fixture': 'withExperiences'});

    return () => (
        <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
            <ApplicationErrorView
                t={mockTranslate}
                visible
            />
        </MockConfigProvider>
    );
};

storiesOf('ApplicationErrorView', module)
    .add('Default', makeStory());
