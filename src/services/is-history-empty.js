import allPass from 'lodash/fp/allPass';
import compose from 'lodash/fp/compose';
import isEmpty from 'lodash/fp/isEmpty';
import negate from 'lodash/fp/negate';

import {queries as paymentQueries} from '@opower/payments-namespace';

import {getState} from '../namespace';
import {queryFinancialHistory} from '../queries';

import {isFetchingData} from './is-fetching-data';

const {queryScheduledPayments} = paymentQueries;
const hasNoScheduledPayments = compose(isEmpty, queryScheduledPayments, getState);
const notFetchingAnything = negate(isFetchingData);

/**
 * Check whether any financial history is stored in redux store. Does not check for loading status or scheduled payments
 * @param globalState
 * @return {boolean} true if financial history is empty.
 */
export const hasNoHistory = compose(isEmpty, queryFinancialHistory, getState);
/**
 * Check whether any financial activity is stored in redux store.
 * @param globalState
 * @return {boolean} false if there is any history or scheduled payment is stored in redux store, or widget is in
 *   loading state
 */
export const isHistoryEmpty = allPass([hasNoHistory, hasNoScheduledPayments, notFetchingAnything]);
