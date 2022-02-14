import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';

import {MockConfigProvider} from '@opower/maestro-react/mock';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {ApplicationErrorView} from './application-error';

describe('ApplicationErrorView', () => {
    it('renders appropriate message when error exists', () => {
        const NoDataWrapper = mount(
            <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
                <ApplicationErrorView
                    t={mockTranslate}
                    visible
                />
            </MockConfigProvider>
        );

        assert.strictEqual(
            NoDataWrapper.find('.loading-error__heading').text(),
            'We\'re sorry, but something went wrong.',
            'renders correct text'
        );

        assert.strictEqual(
            NoDataWrapper.find('.loading-error__subheading').text(),
            'We\'re unable to retrieve your information right now.',
            'renders correct text'
        );

        assert.strictEqual(
            NoDataWrapper.find('.try-again-link a').prop('href'),
            '/xyz',
            'correct link to try again is rendered'
        );

        assert.strictEqual(
            NoDataWrapper.find('.try-again-link a').text(),
            'Please try again later.',
            'correct text for try again link is rendered'
        );
    });

    it('does not render when visibility flag is false', () => {
        const NoDataWrapper = mount(
            <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
                <ApplicationErrorView
                    t={mockTranslate}
                />
            </MockConfigProvider>
        );

        assert.notExists(
            NoDataWrapper.find('.loading-error__heading'),
            'error is not rendered'
        );
    });
});
