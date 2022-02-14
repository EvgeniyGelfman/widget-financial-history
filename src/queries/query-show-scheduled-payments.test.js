import {assert} from 'chai';

import {queryShouldShowScheduledPayments as subject} from './query-should-show-scheduled-payments';
import {DATE_FILTER_OPTIONS, INIT_TRANSACTIONS} from '../constants';

describe('queryShouldShowScheduledPayments', () => {
    it('handles empty state', () => {
        assert.isFalse(subject({}), 'returns false for empty state');
    });

    it('returns true when filtering all transactions for all days', () => {
        assert.isTrue(
            subject({
                dateFilter: DATE_FILTER_OPTIONS.ALL_DATES,
                transactionFilter: INIT_TRANSACTIONS.ALL_TRANSACTIONS
            }),
            'returns true when filtering for all transactions starts from today'
        );
    });

    it('returns true when filtering payments for all days', () => {
        assert.isFalse(
            subject({
                dateFilter: DATE_FILTER_OPTIONS.ALL_DATES,
                transactionFilter: 'C1PS'
            }),
            'returns false when filtering payments for all days'
        );
    });

    it('returns false when filtering for all transactions for LAST_YEAR dates', () => {
        assert.isFalse(
            subject({
                dateFilter: DATE_FILTER_OPTIONS.LAST_YEAR_DATES,
                transactionFilter: INIT_TRANSACTIONS.ALL_TRANSACTIONS
            }),
            'returns false when filtering all transactions does not start from today'
        );
    });

    it('returns false when filtering for payments for LAST_YEAR dates', () => {
        assert.isFalse(
            subject({
                dateFilter: DATE_FILTER_OPTIONS.LAST_YEAR_DATES,
                transactionFilter: 'C1PS'
            }),
            'returns false when filtering payments does not start from today'
        );
    });
});
