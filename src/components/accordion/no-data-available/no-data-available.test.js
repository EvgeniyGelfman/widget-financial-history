import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';

import {MockConfigProvider} from '@opower/maestro-react/mock';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {NoDataAvailableView} from './no-data-available';

describe('NoDataAvailableView', () => {
    it('renders appropriate message when no history exists', () => {
        const NoDataWrapper = mount(
            <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
                <NoDataAvailableView
                    t={mockTranslate}
                    visible
                />
            </MockConfigProvider>
        );

        assert.strictEqual(
            NoDataWrapper.find('.no-data-container .display-smaller').text(),
            'You don’t have any billing and payment history right now.',
            'renders correct text'
        );

        assert.strictEqual(
            NoDataWrapper.find('.no-data-container .quiet').text(),
            'When you receive your first bill or make your first payment, you’ll see them here.',
            'renders correct text'
        );

        assert.strictEqual(
            NoDataWrapper.find('.no-data-container .overview-link a').prop('href'),
            '/xyz',
            'correct link to overview page is rendered'
        );
    });
});
