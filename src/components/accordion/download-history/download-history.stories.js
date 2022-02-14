import React from 'react';
import {storiesOf} from '@storybook/react';
import {I18nextProvider} from 'react-i18next';
import i18nMock from '@opower/i18next-config/mock';
import {MockConfigProvider} from '@opower/maestro-react/mock';
import {Provider as ReduxProvider} from 'react-redux';
import {DownloadHistory} from './index';
import {namespace} from '../../namespace';
import configureMockStore from 'redux-mock-store';

const makeStory = ({loading = false} = {}) => {
    const createMockStore = configureMockStore();
    const someHistory = {financialHistory: {'some-id': {some: 'event'}}};
    const store = createMockStore({[namespace]: {...someHistory, downloadHistory: {isLoading: loading}}});

    return () => (
        <ReduxProvider store={store}>
            <I18nextProvider i18n={i18nMock}>
                <MockConfigProvider
                    widgetConfig={{numberOfViewableBillYears: 5, numberOfRecordsPerPage: 1, csvFields: ''}}
                    getExperienceLink={() => ({url: '/xyz', target: '_self'})}
                >
                    <DownloadHistory />
                </MockConfigProvider>
            </I18nextProvider>
        </ReduxProvider>
    );
};

storiesOf('DownloadHistoryView', module)
    .add('Default', makeStory())
    .add('Loading', makeStory({loading: true}));
