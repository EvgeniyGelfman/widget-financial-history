import React from 'react';

import {MockConfigProvider} from '@opower/maestro-react/mock';
import {storiesOf} from '@storybook/react';

import maestroFixtures from 'maestro|fixtures';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {NoDataAvailableView} from './no-data-available';

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

const makeStory = () => {
    maestroFixtures.activateRuntimeMocks({'config-fixture': 'withExperiences'});
    return () => (
        <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
            <NoDataAvailableView
                t={mockTranslate}
                visible
            />
        </MockConfigProvider>
    );
};

storiesOf('NoDataAvailableView', module)
    .add('Default', makeStory());
