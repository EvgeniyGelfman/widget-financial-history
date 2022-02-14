import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';

import {Provider as ReduxProvider} from 'react-redux';
import {I18nextProvider} from 'react-i18next';
import configureMockStore from 'redux-mock-store';

import {MockConfigProvider} from '@opower/maestro-react/mock';
import i18nMock from '@opower/i18next-config/mock';

import {namespace} from '../../namespace';

import {DownloadHistory as Subject} from '.';

describe('DownloadHistory', () => {

    const createMockStore = configureMockStore();
    const someHistory = {financialHistory: {'some-id': {some: 'event'}}};
    const getSubject = (store, widgetConfigOverrides = {}) => mount(
        <ReduxProvider store={store}>
            <I18nextProvider i18n={i18nMock}>
                <MockConfigProvider
                    widgetConfig={{
                        numberOfViewableBillYears: 5,
                        numberOfRecordsPerPage: 1,
                        csvFields: 'date,label,amount,currency,billId',
                        enabledDownload: true,
                        ...widgetConfigOverrides
                    }}
                    getExperienceLink={() => ({url: '/xyz', target: '_self'})}
                >
                    <Subject />
                </MockConfigProvider>
            </I18nextProvider>
        </ReduxProvider>
    );

    it('renders', () => {
        const store = createMockStore({[namespace]: {...someHistory}});
        const subject = getSubject(store);

        assert.exists(subject.find('.fh__download'), 'DownloadHistory button is renders');
    });

    it('do not renders if history empty', () => {
        const store = createMockStore({});
        const subject = getSubject(store);

        assert.notExists(subject.find('.fh__download'), 'DownloadHistory button should not be rendered if state empty');
    });

    it('do not renders if paginator In error', () => {
        const store = createMockStore({
            [namespace]: {
                ...someHistory,
                dateFilter: 'ALL_PAGES',
                transactionFilter: 'ALL_TRANSACTIONS',
                paginators: {'ALL_PAGES#ALL_TRANSACTIONS': {errors: ['Internal Server Error'], totalRecords: 10050}}
            }
        });
        const subject = getSubject(store);

        assert.notExists(
            subject.find('.fh__download'),
            'DownloadHistory button should not render when paginator in error'
        );
    });

    it('do not renders if app In error', () => {
        const store = createMockStore({
            [namespace]: {
                ...someHistory,
                dateFilter: 'ALL_DATES',
                transactionFilter: 'ALL_TRANSACTIONS',
                paginators: {'ALL_DATES#ALL_TRANSACTIONS': {firstTimeError: 'notnull'}}
            }
        });
        const subject = getSubject(store);

        assert.notExists(subject.find('.fh__download'), 'DownloadHistory button should not render when app in error');
    });

    it('Showing loading icon  when loading history', () => {
        const store = createMockStore({[namespace]: {...someHistory, downloadHistory: {isLoading: true}}});
        const subject = getSubject(store);

        assert.exists(subject.find('LoadingIcon'), 'DownloadHistory button should show LoadingIcon when loading');
    });

    it('does not render download link if it is disabled in configuration', () => {
        const store = createMockStore({[namespace]: {...someHistory}});
        const subject = getSubject(store, {enableDownload: false});

        assert.exists(subject.find('.fh__download'), 'DownloadHistory button is renders, ' +
            'but it is disabled by configuration');
    });
});
