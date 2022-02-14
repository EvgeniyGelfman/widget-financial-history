import {assert} from 'chai';

import {queryErrorsByOffset as subject} from './query-errors-by-offset';

describe('queryErrorsByOffset', () => {
    it('handles empty state', () => {
        assert.deepEqual(
            subject({lowerOffset: 1, upperOffset: 2})({}),
            [],
            'returns empty array when empty state is given'
        );
    });

    it('returns correct errors for selected paginator when single page data is present', () => {
        assert.deepEqual(
            subject({lowerOffset: 0, upperOffset: 1})({
                paginators: {
                    'THIS_YEAR_DATES#PAYMENTS': {
                        errors: ['some error']
                    }
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            ['some error'],
            'returns correct errors for single page result'
        );
    });

    it('returns correct errors for selected paginator when more than one page results are present', () => {
        assert.deepEqual(
            subject({lowerOffset: 2, upperOffset: 4})({
                paginators: {
                    'THIS_YEAR_DATES#PAYMENTS': {
                        entityIds: [0, 1, undefined, undefined],
                        errors: [undefined, undefined, 'error', 'error']
                    }
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            ['error', 'error'],
            'returns correct errors when multiple page results are present'
        );
    });

    it('returns errors for correct paginator', () => {
        assert.deepEqual(
            subject({lowerOffset: 0, upperOffset: 2})({
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        errors: ['internal error', 'internal error', 'internal error', 'internal error']
                    },
                    'THIS_YEAR_DATES#PAYMENTS': {
                        errors: ['some error', 'some error']
                    }
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            ['internal error', 'internal error'],
            'returns errors for correct paginator'
        );
    });
});
