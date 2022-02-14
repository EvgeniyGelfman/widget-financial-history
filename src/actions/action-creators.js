import {createAction} from '../namespace';

export const setPaginator = createAction('SET_PAGINATOR');
export const requestFinancialHistoryAction = createAction('REQUEST_FINANCIAL_HISTORY');
export const receiveFinancialHistoryAction = createAction('RECEIVE_FINANCIAL_HISTORY');
export const receiveTransactionFilter = createAction('RECEIVE_TRANSACTION_FILTER');
export const receiveFinancialHistoryErrorAction = createAction('RECEIVE_FINANCIAL_HISTORY_ERROR');
export const resetFinancialHistoryAction = createAction('RESET_FINANCIAL_HISTORY');
export const toggleAccordionAction = createAction('TOGGLE_ACCORDION');
export const selectDateFilterAction = createAction('SELECT_DATE_FILTER');
export const resetDateFilterAction = createAction('RESET_DATE_FILTER');
export const selectTransactionFilterAction = createAction('SELECT_TRANSACTION_FILTER');
export const resetTransactionFilterAction = createAction('RESET_TRANSACTION_FILTER');
export const resetFilterAction = createAction('RESET_FILTER');
export const goToNextPageAction =  createAction('GOTO_NEXT_PAGE');
export const goToPreviousPageAction = createAction('GOTO_PREVIOUS_PAGE');

export const fetchHistoryStarted = createAction('FETCH_HISTORY_STARTED');
export const fetchHistorySuccess = createAction('FETCH_HISTORY_SUCCESS');
export const fetchHistoryError = createAction('FETCH_HISTORY_ERROR');

export const resetWidgetState = createAction('RESET_WIDGET_STATE');
