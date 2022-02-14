import {assert} from 'chai';
import reduce from 'lodash/fp/reduce';
import set from 'lodash/fp/set';

import {receiveFinancialHistoryErrorAction} from '../actions';

import {paginatorReducer as subject} from './paginator-reducer';

const options = {
    ALL_DATES: 'ALL_DATES',
    THIS_YEAR_DATES: 'THIS_YEAR_DATES',
    LAST_YEAR_DATES: 'LAST_YEAR_DATES'
};

const getInitialState = (state, paginator) => {
    return set(
        paginator,
        {
            id: paginator,
            isFetching: false,
            isSuccess: false,
            firstTimeError: null,
            errors: [],
            entityIds: [],
            totalRecords: -1,
            discardedCount: 0
        },
        state
    );
};

const u = undefined;

describe('paginatorReducer - receive error action', () => {
    let initialState;

    beforeEach(() => {
        initialState = reduce(getInitialState, {}, options);
    });

    it('handles receive financial history error action for first page', () => {
        const state = subject(
            {
                ...initialState,
                ['ALL_DATES']: {
                    ...initialState.ALL_DATES,
                    isFetching: true
                }
            },
            receiveFinancialHistoryErrorAction(
                {
                    selectedPaginator: 'ALL_DATES',
                    error: {details: 'INTERNAL_SERVER_ERROR'},
                    offset: 0,
                    limit: 10
                }
            )
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ALL_DATES: {
                    ...initialState.ALL_DATES,
                    isFetching: false,
                    firstTimeError: 'INTERNAL_SERVER_ERROR'
                }
            },
            'handles receive financial history error action'
        );
    });

    it('handles receive financial history error action for arbitrary page', () => {
        const state = subject(
            {
                ...initialState,
                ['ALL_DATES']: {
                    isFetching: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, u, u, u, u],
                    totalRecords: 7,
                    discardedCount: 0
                }
            },
            receiveFinancialHistoryErrorAction({
                selectedPaginator: 'ALL_DATES',
                error: {details: 'some error'},
                offset: 4,
                limit: 2
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES']: {
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, u, u, 'some error', 'some error', u],
                    entityIds: ['B-11', 'P-22', u, u, u, u, u],
                    totalRecords: 7,
                    discardedCount: 0
                }
            },
            'merges the state correctly when error occurs for arbitrary page'
        );
    });

    it('handles receive financial history error action for last page', () => {
        const state = subject(
            {
                ...initialState,
                ['ALL_DATES']: {
                    isFetching: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', 'B-33', u, u, u, u],
                    totalRecords: 7,
                    discardedCount: 0
                }
            },
            receiveFinancialHistoryErrorAction({
                selectedPaginator: 'ALL_DATES',
                error: {details: 'some error'},
                offset: 6,
                limit: 3
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES']: {
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u, 'some error'],
                    entityIds: ['B-11', 'P-22', 'B-33', u, u, u, u],
                    totalRecords: 7,
                    discardedCount: 0
                }
            },
            'merges the state correctly when error occurs for last page'
        );
    });

    it('adjusts the error offset for previously discarded count', () => {
        const state = subject(
            {
                ...initialState,
                ['ALL_DATES']: {
                    isFetching: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u],
                    entityIds: ['B-11', u, u, u, u],
                    totalRecords: 5,
                    discardedCount: 2
                }
            },
            receiveFinancialHistoryErrorAction({
                selectedPaginator: 'ALL_DATES',
                error: {details: 'some error'},
                offset: 4,
                limit: 2
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES']: {
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, 'some error', 'some error', u],
                    entityIds: ['B-11', u, u, u, u],
                    totalRecords: 5,
                    discardedCount: 2
                }
            },
            'accounts for previously discarded records when storing errors'
        );
    });

    it('overrides the previous state if first page errored out', () => {
        const state = subject(
            {
                ...initialState,
                ['ALL_DATES']: {
                    id: 'ALL_DATES',
                    isFetching: true,
                    firstTimeError: null,
                    errors: [u, u, u, 'Error', 'Error', u],
                    entityIds: ['B-11', 'P-22', u, u, u, u],
                    totalRecords: 6,
                    discardedCount: 1
                }
            },
            receiveFinancialHistoryErrorAction({
                selectedPaginator: 'ALL_DATES',
                error: {message: 'new error'},
                offset: 0,
                limit: 5
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES']: {
                    id: 'ALL_DATES',
                    isFetching: false,
                    isSuccess: false,
                    firstTimeError: 'new error',
                    errors: [],
                    entityIds: [],
                    totalRecords: -1,
                    discardedCount: 0
                }
            },
            'overrides previous state if first page response was received'
        );
    });
});
