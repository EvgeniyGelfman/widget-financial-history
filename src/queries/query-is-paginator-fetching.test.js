import {assert} from 'chai';

import {queryIsPaginatorFetching as subject} from './query-is-paginator-fetching';

describe('queryIsPaginatorFetching', () => {
    it('handles empty state', () => {
        assert.isUndefined(
            subject({}),
            'returns false when state is empty'
        );
    });

    it('returns correct value based on selected paginator', () => {
        assert.isTrue(
            subject({
                paginators: {
                    'ALL_DATES#PAYMENTS': {isFetching: true},
                    'THIS_YEAR_DATES#PAYMENTS': {isFetching: false}
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            'returns correct value based on selected paginator'
        );

        assert.isFalse(
            subject({
                paginators: {
                    'ALL_DATES#PAYMENTS': {isFetching: true},
                    'THIS_YEAR_DATES#PAYMENTS': {isFetching: false}
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            'returns correct value when state changes'
        );
    });
});
