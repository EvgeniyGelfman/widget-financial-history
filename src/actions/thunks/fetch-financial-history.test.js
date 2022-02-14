import {assert} from 'chai';
import get from 'lodash/fp/get';
import fetchMock from 'fetch-mock';
import moment from 'moment-timezone';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import url from '@opower/url';

import {namespace} from '../../namespace';
import {
    fetchFinancialHistoryIfNecessary as subject,
    receiveFinancialHistoryAction,
    receiveFinancialHistoryErrorAction,
    requestFinancialHistoryAction,
    receiveTransactionFilter,
    setPaginator
} from '..';

const createMockStore = configureMockStore([thunk]);

const numberOfViewableBillYears = 5;
const numberOfRecordsPerPage = 1;
const todayDate = moment().format('YYYY-MM-DD');
const earliestDate = moment().subtract(numberOfViewableBillYears, 'years').format('YYYY-MM-DD');

const newPaginator = {
    'ALL_DATES#': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'ALL_DATES#',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'ALL_DATES#C1BL': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'ALL_DATES#C1BL',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'ALL_DATES#C1PD': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'ALL_DATES#C1PD',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'LAST_YEAR_DATES#': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'LAST_YEAR_DATES#',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'LAST_YEAR_DATES#C1BL': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'LAST_YEAR_DATES#C1BL',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'LAST_YEAR_DATES#C1PS': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'LAST_YEAR_DATES#C1PS',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'LAST_YEAR_DATES#C1PD': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'LAST_YEAR_DATES#C1PD',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'THIS_YEAR_DATES#': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'THIS_YEAR_DATES#',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'THIS_YEAR_DATES#C1BL': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'THIS_YEAR_DATES#C1BL',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'THIS_YEAR_DATES#C1PS': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'THIS_YEAR_DATES#C1PS',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    },
    'THIS_YEAR_DATES#C1PD': {
        discardedCount: 0,
        entityIds: [],
        errors: [],
        firstTimeError: null,
        id: 'THIS_YEAR_DATES#C1PD',
        isFetching: false,
        isSuccess: false,
        totalRecords: -1
    }
};

const defaultState = {
    [namespace]: {
        scheduledPayments: [],
        financialHistory: {},
        dateFilter: 'ALL_DATES',
        transactionFilter: 'C1PS',
        pageNumber: 1,
        paginators: {
            'ALL_DATES#C1PS': {
                id: 'ALL_DATES#C1PS',
                isFetching: false,
                entityIds: [],
                totalRecords: -1,
                discardedCount: 0
            },
            filterCriteriaRecords: {}
        }
    }
};

describe('fetchFinancialHistoryIfNecessary - dispatch', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('dispatches appropriate actions when fetch is possible', async () => {
        fetchMock.get(/financialHistory/, {
            recentDate: todayDate,
            pastDate: earliestDate,
            offset: 0,
            totalRecords: 1,
            history: [{
                date: '2017-04-26',
                label: 'Bill',
                type: 'C',
                amount: -111.5,
                currency: '$',
                currencyCode: 'USD',
                billId: null,
                billDetails: [],
                payDetail: null
            }],
            filterCriteriaRecords: [
                {
                    filterType: 'C1AD',
                    filterTypeDescription: 'Adjustments'
                },
                {
                    filterType: 'C1BL',
                    filterTypeDescription: 'Bills'
                },
                {
                    filterType: 'C1PS',
                    filterTypeDescription: 'Payments'
                }
            ]
        });

        const expectedActions = [
            requestFinancialHistoryAction({selectedPaginator: 'ALL_DATES#C1PS'}),
            receiveTransactionFilter({
                filterCriteriaRecords: [
                    {
                        filterType: '',
                        filterTypeDescription: 'ALL_TRANSACTIONS'
                    },
                    {
                        filterType: 'C1PD',
                        filterTypeDescription: 'PENDING_TRANSACTIONS'
                    },
                    {
                        filterType: 'C1BL',
                        filterTypeDescription: 'Bills'
                    },
                    {
                        filterType: 'C1PS',
                        filterTypeDescription: 'Payments'
                    }
                ]
            }),
            setPaginator({
                newPaginator: newPaginator
            }),
            receiveFinancialHistoryAction({
                totalRecords: 1,
                offset: 0,
                selectedPaginator: 'ALL_DATES#C1PS',
                history: [{
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: null,
                    billDetails: [],
                    payDetail: null
                }]
            })
        ];

        const store = createMockStore({
            [namespace]: {
                financialHistory: {},
                dateFilter: 'ALL_DATES',
                transactionFilter: 'C1PS',
                paginators: {
                    'ALL_DATES#C1PS': {
                        id: 'ALL_DATES#C1PS',
                        isFetching: false,
                        firstTimeError: null,
                        errors: [],
                        entityIds: [],
                        totalRecords: -1,
                        discardedCount: 0
                    },
                    filterCriteriaRecords: {}
                }
            }
        });

        await store.dispatch(subject({numberOfRecordsPerPage, numberOfViewableBillYears}));

        assert.deepEqual(store.getActions(), expectedActions, 'request and receive actions dispatched');
    });

    it('dispatches error action when API request fails', async () => {
        fetchMock.get(/financialHistory/, 500);

        const store = createMockStore({
            [namespace]: {
                dateFilter: 'ALL_DATES',
                transactionFilter: 'C1PS',
                paginators: {
                    'ALL_DATES#C1PS': {
                        id: 'ALL_DATES#C1PS',
                        isFetching: false,
                        error: null,
                        entityIds: [],
                        totalRecords: -1
                    }
                }
            }
        });

        await store.dispatch(subject({numberOfRecordsPerPage, numberOfViewableBillYears}));

        const errorAction = store.getActions()[1];

        assert.equal(
            errorAction.type,
            receiveFinancialHistoryErrorAction.toString(),
            'REQUEST_FINANCIAL_HISTORY_ERROR action was dispatched for unsuccessful CWS call'
        );
    });
});

describe('fetchFinancialHistoryIfNecessary - financialHistory API call', () => {
    let initialState;

    beforeEach(() => {
        initialState = defaultState;
    });

    afterEach(() => {
        fetchMock.restore();
    });

    it('calls the API when paginator totalRecords is -1', async () => {
        fetchMock.get(/financialHistory/, 200);

        const store = createMockStore(initialState);

        await store.dispatch(subject({numberOfRecordsPerPage, numberOfViewableBillYears}));

        assert.strictEqual(fetchMock.calls().length, 1, 'api is called on first paginator load');

        assert.deepEqual(
            url.parse(fetchMock.lastUrl()).query,
            {
                filterCriteria: 'C1PS',
                period: 'P5y',
                offset: '0',
                limit: '15'
            },
            'sets correct query parameter values'
        );
    });

    it('calls the API when current page has one or more undefined entityIds', async () => {
        fetchMock.get(/financialHistory/, 200);

        const store = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1PS': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1PS'], initialState),
                        totalRecords: 2,
                        entityIds: ['P-1', undefined]
                    }
                }
            }
        });

        await store.dispatch(subject({numberOfRecordsPerPage: 2, numberOfViewableBillYears}));

        assert.strictEqual(fetchMock.calls().length, 1, 'api is called when there is undefined data');

        assert.deepEqual(
            url.parse(fetchMock.lastUrl()).query,
            {
                filterCriteria: 'C1PS',
                period: 'P5y',
                offset: '1',
                limit: '15'
            },
            'sets correct query parameter values'
        );
    });

    it('does not call the API when paginator totalRecords is 0', async () => {
        fetchMock.get(/financialHistory/, {});

        const store = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1PS': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1PS'], initialState),
                        totalRecords: 0
                    }
                }
            }
        });

        await store.dispatch(subject({numberOfRecordsPerPage, numberOfViewableBillYears}));

        assert.isFalse(fetchMock.called(), 'api is not called when paginator is empty');
    });

    it('does not call the API when another action is already fetching data (isFetching: true)', async () => {
        fetchMock.get(/financialHistory/, {});

        const store = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1PS': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1PS'], initialState),
                        totalRecords: 1,
                        isFetching: true
                    }
                }
            }
        });

        await store.dispatch(subject({numberOfRecordsPerPage, numberOfViewableBillYears}));

        assert.isFalse(fetchMock.called(), 'api is not called when another action is still fetching');
    });

    it('does not call the API when current page\'s data are already cached', async () => {
        fetchMock.get(/financialHistory/, {});

        const store = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1PS': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1PS'], initialState),
                        totalRecords: 2,
                        entityIds: ['P-1', 'B-1']
                    }
                }
            }
        });

        await store.dispatch(subject({numberOfRecordsPerPage, numberOfViewableBillYears}));

        assert.isFalse(fetchMock.called(), 'api is not called if page data is already cached');
    });

});
