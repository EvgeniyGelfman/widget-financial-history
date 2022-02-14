import {combineReducers} from 'redux';

import {accordionReducer} from './accordion-reducer';
import {dateFilterReducer} from './date-filter-reducer';
import {transactionFilterReducer} from './transaction-filter-reducer';
import {financialHistoryReducer} from './financial-history-reducer';
import {pageNumberReducer} from './page-number-reducer';
import {paginatorReducer} from './paginator-reducer';
import {downloadHistoryReducer} from './download-history-reducer';
import {resetWidgetState} from '../actions/action-creators';
import {reducers as paymentReducers} from '@opower/payments-namespace';
import {transactionFilterValuesReducer} from './transaction-filter-values-reducer';

export const appReducer = combineReducers({
    scheduledPayments: paymentReducers.scheduledPayments,
    financialHistory: financialHistoryReducer,
    accordion: accordionReducer,
    dateFilter: dateFilterReducer,
    transactionFilter: transactionFilterReducer,
    paginators: paginatorReducer,
    pageNumber: pageNumberReducer,
    downloadHistory: downloadHistoryReducer,
    transactionFilterValues: transactionFilterValuesReducer
});

export const rootReducer = (state, action) => {
    if (action.type === resetWidgetState.toString()) {
        state = undefined;
    }

    return appReducer(state, action);
};
