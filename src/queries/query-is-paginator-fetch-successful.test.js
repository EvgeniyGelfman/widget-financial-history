import {assert} from 'chai';

import {queryIsPaginatorFetchSuccessful as subject} from './query-is-paginator-fetch-successful';

describe('queryIsPaginatorFetchSuccessful', () => {
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
                    'ALL_DATES#PAYMENTS': {isSuccess: true},
                    'THIS_YEAR_DATES#PAYMENTS': {isSuccess: false}
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            'returns correct value based on selected paginator'
        );

        assert.isFalse(
            subject({
                paginators: {
                    'ALL_DATES#PAYMENTS': {isSuccess: true},
                    'THIS_YEAR_DATES#PAYMENTS': {isSuccess: false}
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            'returns correct value when state changes'
        );
    });
});
