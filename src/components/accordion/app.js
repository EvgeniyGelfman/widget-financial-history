import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {Provider as ReduxProvider} from 'react-redux';

import i18n from '@opower/i18next-config';
import {WidgetConfigProvider} from '@opower/maestro-react';

import {store} from '../store';

import {FinancialHistoryContainer} from './financial-history-container';

export const App = () => {
    return (
        <ReduxProvider store={store}>
            <I18nextProvider i18n={i18n} defaultNS="widget-financial-history">
                <WidgetConfigProvider name="widget-financial-history">
                    <FinancialHistoryContainer />
                </WidgetConfigProvider>
            </I18nextProvider>
        </ReduxProvider>
    );
};
