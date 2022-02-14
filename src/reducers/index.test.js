import {assert} from 'chai';

import {rootReducer} from './index';
import {toggleAccordionAction} from '../actions';
import {resetWidgetState} from '../actions/action-creators';

const initialState = {
    scheduledPayments: {
        entities: {},
        entityIds: [],
        error: null,
        isFetching: false
    },
    accordion: {},
    dateFilter: 'ALL_DATES',
    transactionFilter: '',
    transactionFilterValues: {},
    downloadHistory: {
        error: null,
        isLoading: false,
        isSuccess: false
    },
    financialHistory: {},
    pageNumber: 1,
    paginators: {
        ALL_DATES: {
            discardedCount: 0,
            entityIds: [],
            errors: [],
            firstTimeError: null,
            id: 'ALL_DATES',
            isFetching: false,
            isSuccess: false,
            totalRecords: -1
        },
        THIS_YEAR_DATES: {
            discardedCount: 0,
            entityIds: [],
            errors: [],
            firstTimeError: null,
            id: 'THIS_YEAR_DATES',
            isFetching: false,
            isSuccess: false,
            totalRecords: -1
        },
        LAST_YEAR_DATES: {
            discardedCount: 0,
            entityIds: [],
            errors: [],
            firstTimeError: null,
            id: 'LAST_YEAR_DATES',
            isFetching: false,
            isSuccess: false,
            totalRecords: -1
        }
    }
};

describe('rootReducer', () => {

    it('resets widget state on `resetWidgetState` action', () => {
        const state = rootReducer({foo: 'bar'}, resetWidgetState());

        assert.deepEqual(
            state,
            initialState
        );
    });

    it('does not reset state when action is any action other than "setSelectedAccount"', () => {
        const state = rootReducer(initialState, toggleAccordionAction({entityId: 0}));

        assert.deepEqual(
            state,
            {
                scheduledPayments: {
                    entities: {},
                    entityIds: [],
                    error: null,
                    isFetching: false
                },
                accordion: {
                    0: true
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: '',
                transactionFilterValues: {},
                downloadHistory: {
                    error: null,
                    isLoading: false,
                    isSuccess: false
                },
                financialHistory: {},
                pageNumber: 1,
                paginators: {
                    ALL_DATES: {
                        discardedCount: 0,
                        entityIds: [],
                        errors: [],
                        firstTimeError: null,
                        id: 'ALL_DATES',
                        isFetching: false,
                        isSuccess: false,
                        totalRecords: -1
                    },
                    THIS_YEAR_DATES: {
                        discardedCount: 0,
                        entityIds: [],
                        errors: [],
                        firstTimeError: null,
                        id: 'THIS_YEAR_DATES',
                        isFetching: false,
                        isSuccess: false,
                        totalRecords: -1
                    },
                    LAST_YEAR_DATES: {
                        discardedCount: 0,
                        entityIds: [],
                        errors: [],
                        firstTimeError: null,
                        id: 'LAST_YEAR_DATES',
                        isFetching: false,
                        isSuccess: false,
                        totalRecords: -1
                    }
                }
            }
        );
    });
});
