import {assert} from 'chai';

import {queryFinancialHistoryByOffsets as subject} from './query-financial-history-by-offsets';

describe('queryFinancialHistoryByOffsets', () => {
    it('handles empty state', () => {
        assert.deepEqual(
            subject({lowerOffset: 1, upperOffset: 2})({}),
            [],
            'returns empty array when empty state is given'
        );
    });

    it('returns correct records for selected paginator when single page data is present', () => {
        assert.deepEqual(
            subject({lowerOffset: 0, upperOffset: 1})({
                financialHistory: {
                    0: {id: 0}
                },
                paginators: {
                    'THIS_YEAR_DATES#PAYMENTS': {
                        entityIds: [0]
                    }
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            [{id: 0}],
            'returns correct records for single page result'
        );
    });

    it('returns correct records for selected paginator when more than one page results are present', () => {
        assert.deepEqual(
            subject({lowerOffset: 2, upperOffset: 4})({
                financialHistory: {
                    0: {id: 0},
                    1: {id: 1},
                    2: {id: 2},
                    3: {id: 3}
                },
                paginators: {
                    'THIS_YEAR_DATES#PAYMENTS': {
                        entityIds: [0, 1, 2, 3]
                    }
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            [{id: 2}, {id: 3}],
            'returns correct records when multiple page results are present'
        );
    });

    it('returns records for correct paginator', () => {
        assert.deepEqual(
            subject({lowerOffset: 0, upperOffset: 2})({
                financialHistory: {
                    0: {id: 0},
                    1: {id: 1},
                    2: {id: 2},
                    3: {id: 3}
                },
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        entityIds: [0, 1, 2, 3]
                    },
                    'THIS_YEAR_DATES#PAYMENTS': {
                        entityIds: [2, 3]
                    }
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            [{id: 0}, {id: 1}],
            'returns records for correct paginator'
        );
    });
});
