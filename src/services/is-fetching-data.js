import anyPass from 'lodash/fp/anyPass';
import compose from 'lodash/fp/compose';

import {queries as paymentQueries} from '@opower/payments-namespace';
import {selectedAccount} from '@opower/account-namespace/queries';

import {getState} from '../namespace';
import {queryIsPaginatorFetching} from '../queries';

// takes global state
export const isFetchingData = anyPass([
    compose(paymentQueries.queryIsFetchingScheduledPayments, getState),
    compose(queryIsPaginatorFetching, getState),
    selectedAccount.isLoading
]);
