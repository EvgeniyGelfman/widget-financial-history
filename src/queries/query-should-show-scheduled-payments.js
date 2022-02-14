import compose from 'lodash/fp/compose';
import eq from 'lodash/fp/eq';
import negate from 'lodash/fp/negate';
import get from 'lodash/fp/get';
import anyPass from 'lodash/fp/anyPass';

import {DATE_FILTER_OPTIONS, INIT_TRANSACTIONS} from '../constants';

/**
 * Scheduled payments generally always should be displayed as first rows in the history. The exception is
 * when date filter set to other than All transactions (''), in this case we are looking at not all transactions  and
 * when date filter set to LAST_YEAR_DATES, in this case we are looking at the old billing history and
 * scheduled payments should be hidden.
 */
export const queryShouldShowScheduledPayments = (state) => {
    return compose(
        negate(eq(DATE_FILTER_OPTIONS.LAST_YEAR_DATES)),
        get('dateFilter')
    )(state) &&
    compose(
        anyPass([eq(INIT_TRANSACTIONS.ALL_TRANSACTIONS), eq(INIT_TRANSACTIONS.PENDING_TRANSACTIONS)]),
        get('transactionFilter')
    )(state);
};
