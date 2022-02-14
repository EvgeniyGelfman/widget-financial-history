import {assert} from 'chai';

import {querySelectedPaginator as subject} from './query-selected-paginator';

const paginators = {
    'ALL_DATES#PAYMENTS': {
        id: 'ALL_DATES#PAYMENTS',
        isFetching: false,
        error: null,
        entityIds: ['P-1', 'P-2', 'C-1'],
        totalRecords: 3
    },
    'THIS_YEAR_DATES#PAYMENTS': {
        id: 'THIS_YEAR_DATES#PAYMENTS',
        isFetching: false,
        error: null,
        entityIds: ['P-1'],
        totalRecords: 1
    }
};

describe('querySelectedPaginator', () => {
    it('handles empty state', () => {
        assert.isUndefined(
            subject({}),
            'return undefined when state is empty'
        );
    });

    it('returns correct value based on selected paginator Id', () => {
        assert.deepEqual(
            subject({dateFilter: 'ALL_DATES', transactionFilter: 'PAYMENTS', paginators}),
            {
                id: 'ALL_DATES#PAYMENTS',
                isFetching: false,
                error: null,
                entityIds: ['P-1', 'P-2', 'C-1'],
                totalRecords: 3
            },
            'returns correct paginator slice from state'
        );

        assert.deepEqual(
            subject({dateFilter: 'THIS_YEAR_DATES', transactionFilter: 'PAYMENTS', paginators}),
            {
                id: 'THIS_YEAR_DATES#PAYMENTS',
                isFetching: false,
                error: null,
                entityIds: ['P-1'],
                totalRecords: 1
            },
            'returns correct paginator slice from updated state'
        );
    });
});
