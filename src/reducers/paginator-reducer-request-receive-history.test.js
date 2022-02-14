import {assert} from 'chai';
import reduce from 'lodash/fp/reduce';
import set from 'lodash/fp/set';

import {
    receiveFinancialHistoryAction,
    receiveFinancialHistoryErrorAction,
    requestFinancialHistoryAction
} from '../actions';

import {paginatorReducer as subject} from './paginator-reducer';

const options = {
    ALL_DATES: 'ALL_DATES',
    LAST_YEAR_DATES: 'LAST_YEAR_DATES',
    THIS_YEAR_DATES: 'THIS_YEAR_DATES'
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

describe('paginatorReducer - request or receive history action', () => {
    let initialState;

    beforeEach(() => {
        initialState = reduce(getInitialState, {}, options);
    });

    it('returns initial state when undefined state is passed', () => {
        const state = subject(undefined, {});

        assert.deepEqual(
            state,
            initialState,
            'initial state is returned when undefined state is passed'
        );
    });

    it('handles the request financial history action correctly', () => {
        const state = subject(initialState, requestFinancialHistoryAction({selectedPaginator: 'ALL_DATES#C1AL'}));

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    ...state['ALL_DATES#C1AL'],
                    isFetching: true
                }
            },
            'handles the request financial history action correctly'
        );
    });

    it('handles the receive financial history action correctly', () => {
        const history = [{
            type: 'C',
            billId: '11'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '22'
            }
        }];
        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            initialState,
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                filterCriteriaRecords: filterCriteriaRecords,
                totalRecords: 2,
                offset: 0
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [undefined, undefined],
                    entityIds: ['B-11', 'P-22'],
                    totalRecords: 2,
                    discardedCount: 0
                }
            },
            'handles the receive financial history action correctly'
        );
    });

    it('handles receive financial history error action', () => {
        const state = subject(
            initialState,
            receiveFinancialHistoryErrorAction(
                {
                    selectedPaginator: 'ALL_DATES',
                    error: {details: 'INTERNAL_SERVER_ERROR'}
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
                    firstTimeError: 'INTERNAL_SERVER_ERROR',
                    totalRecords: -1
                }
            },
            'handles receive financial history error action'
        );
    });

    it('handles receive financial history action with an empty history', () => {
        const state = subject(
            initialState,
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history: [],
                totalRecords: 0,
                offset: 0,
                filterCriteriaRecords: [
                    {
                        filterType: 'C1AL',
                        filterTypeDescription: 'All Financial Transactions'
                    }
                ]
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [],
                    entityIds: [],
                    totalRecords: 0,
                    discardedCount: 0
                }
            },
            'handles receive financial history action with an empty history'
        );
    });

    it('resets firstTimeError if successful response was received', () => {
        const state = subject(
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {...initialState.ALL_DATES, firstTimeError: 'internal error', isFetching: true}
            },
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history: [],
                totalRecords: 0,
                offset: 0,
                filterCriteriaRecords: [
                    {
                        filterType: 'C1AL',
                        filterTypeDescription: 'All Financial Transactions'
                    }
                ]
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [],
                    entityIds: [],
                    totalRecords: 0,
                    discardedCount: 0
                }
            },
            'resets the firstTimeError correctly when successful response is received'
        );
    });

    it('discards the unwanted records', () => {
        const history = [{
            type: 'AD',
            billId: '11'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '22'
            }
        }];

        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            initialState,
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                totalRecords: 2,
                offset: 0,
                filterCriteriaRecords
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [u],
                    entityIds: ['P-22'],
                    totalRecords: 1,
                    discardedCount: 1
                }
            },
            'discarded unwanted records and set correct discardedCount'
        );
    });

    it('handles the first page of successful paginated response', () => {
        const history = [{
            type: 'C',
            billId: '11'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '22'
            }
        }];

        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            initialState,
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                totalRecords: 7,
                offset: 0,
                filterCriteriaRecords
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, u, u, u, u],
                    totalRecords: 7,
                    discardedCount: 0
                }
            },
            'handled first page of the paginated response correctly'
        );
    });

    it('handles the arbitrary page of successful paginated response correctly', () => {
        const history = [{
            type: 'C',
            billId: '33'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '44'
            }
        }];

        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, u, u, u, u],
                    totalRecords: 7,
                    discardedCount: 0
                }
            },
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                offset: 4,
                filterCriteriaRecords
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, u, 'B-33', 'P-44', u],
                    totalRecords: 7,
                    discardedCount: 0
                }
            },
            'handled arbitrary page of the paginated response correctly'
        );
    });

    it('accounts for previously discarded records for successful response', () => {
        const history = [{
            type: 'C',
            billId: '33'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '44'
            }
        }];

        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, u, u, u],
                    totalRecords: 6,
                    discardedCount: 1
                }
            },
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                offset: 4,
                filterCriteriaRecords
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, 'B-33', 'P-44', u],
                    totalRecords: 6,
                    discardedCount: 1
                }
            },
            'accounted for previously discarded records for successful response'
        );
    });

    // This is not a valid test as we are assuming that the "discardable" records which includes
    // Adjustments, Cancelled Adjustments or Unbilled Charges can only appear at the start of the first page response.
    // This test however shows how it will keep adjusting the `totalRecords` if that assumption was violated.
    // This will result in a bad user experience where after viewing certain number of `totalRecords` or `total
    // pages`, they will suddenly change when next response is received.
    it('accounts for newly discardable records for successful response', () => {
        const history = [{
            type: 'AX',
            billId: '33'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '44'
            }
        }];

        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, u, u, u],
                    totalRecords: 6,
                    discardedCount: 1
                }
            },
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                offset: 4,
                filterCriteriaRecords
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, 'P-44', u],
                    totalRecords: 5,
                    discardedCount: 2
                }
            },
            'adjusts totalRecords if unwanted records are received in any other page than first page'
        );
    });

    it('resets the errors for arbitrary page if successful response was received for that page', () => {
        const history = [{
            type: 'C',
            billId: '33'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '44'
            }
        }];

        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, u, 'Error', 'Error', u],
                    entityIds: ['B-11', 'P-22', u, u, u, u],
                    totalRecords: 6,
                    discardedCount: 1
                }
            },
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                offset: 4,
                filterCriteriaRecords
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [u, u, u, u, u, u],
                    entityIds: ['B-11', 'P-22', u, 'B-33', 'P-44', u],
                    totalRecords: 6,
                    discardedCount: 1
                }
            },
            'reset errors for the aribtrary page when successful response is received'
        );
    });

    it('overrides the previous state if first page response was received', () => {
        const history = [{
            type: 'C',
            billId: '33'
        }, {
            type: 'P',
            payDetail: {
                paymentId: '44'
            }
        }];

        const filterCriteriaRecords = [
            {
                filterType: 'C1AL',
                filterTypeDescription: 'All Financial Transactions'
            }
        ];

        const state = subject(
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    firstTimeError: null,
                    errors: [u, u, u, 'Error', 'Error', u],
                    entityIds: ['B-11', 'P-22', u, u, u, u],
                    totalRecords: 6,
                    discardedCount: 1
                }
            },
            receiveFinancialHistoryAction({
                selectedPaginator: 'ALL_DATES#C1AL',
                history,
                offset: 0,
                totalRecords: 3,
                filterCriteriaRecords
            })
        );

        assert.deepEqual(
            state,
            {
                ...initialState,
                ['ALL_DATES#C1AL']: {
                    id: 'ALL_DATES#C1AL',
                    isFetching: false,
                    isSuccess: true,
                    firstTimeError: null,
                    errors: [u, u, u],
                    entityIds: ['B-33', 'P-44', u],
                    totalRecords: 3,
                    discardedCount: 0
                }
            },
            'overrides previous state if first page response was received'
        );
    });

    it('leaves state untouched for an arbitrary action', () => {
        assert.deepEqual(
            subject({
                ...initialState,
                ['ALL_DATES']: {
                    id: 'ALL_DATES',
                    isFetching: false,
                    error: null,
                    entityIds: [],
                    totalRecords: 0
                }
            },
            {type: 'Arbitrary'}),
            {
                ...initialState,
                ['ALL_DATES']: {
                    id: 'ALL_DATES',
                    isFetching: false,
                    error: null,
                    entityIds: [],
                    totalRecords: 0
                }
            },
            'state was untouched after an arbitrary action was fired'
        );
    });
});
