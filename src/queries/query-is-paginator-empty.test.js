import {assert} from 'chai';

import {queryIsPaginatorEmpty as subject} from './query-is-paginator-empty';

describe('queryIsPaginatorEmpty', () => {
    it('handles empty state', () => {
        assert.isFalse(
            subject({}),
            'returns false when state is empty'
            // this is because before fetching data, we don't know if any bills
            // are available, so we assume there are some bills (otherwise we will end up displaying no-data at the
            // beginning instead of a spinner)
        );
    });

    it('returns false for initial state', () => {
        assert.isFalse(
            subject({
                dateFilter: 'ALL_DATES',
                paginators: {ALL_DATES: {totalRecords: -1}}
            }),
            'returns false for initial state'
        );
    });

    it('returns correct value based on selected paginator', () => {
        assert.isFalse(
            subject({
                paginators: {
                    'ALL_DATES#PAYMENTS': {totalRecords: 5},
                    'THIS_YEAR_DATES#PAYMENTS': {totalRecords: 0}
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            'returns correct value based on selected paginator'
        );

        assert.isTrue(
            subject({
                paginators: {
                    'ALL_DATES#PAYMENTS': {totalRecords: 5},
                    'THIS_YEAR_DATES#PAYMENTS': {totalRecords: 0}
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            'returns correct value when state changes'
        );
    });
});
