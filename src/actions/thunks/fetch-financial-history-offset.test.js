import {assert} from 'chai';
import fetchMock from 'fetch-mock';
import get from 'lodash/fp/get';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import url from '@opower/url';

import {namespace} from '../../namespace';
import {fetchFinancialHistoryIfNecessary as subject} from '..';

const createMockStore = configureMockStore([thunk]);

const numberOfViewableBillYears = 5;

const defaultState = {
    [namespace]: {
        scheduledPayments: [],
        financialHistory: {},
        dateFilter: 'ALL_DATES',
        transactionFilter: 'C1AL',
        pageNumber: 1,
        paginators: {
            'ALL_DATES#C1AL': {
                id: 'ALL_DATES#C1AL',
                isFetching: false,
                entityIds: [],
                totalRecords: -1,
                discardedCount: 0
            }
        }
    }
};

describe('fetchFinancialHistoryIfNecessary - offset calculation', () => {
    let initialState;

    beforeEach(() => {
        initialState = defaultState;
    });

    afterEach(() => {
        fetchMock.restore();
    });

    it('calculates offset with discarded count, if it exists', async () => {
        fetchMock.get(/financialHistory/, 200);

        const storeWithoutDiscardedData = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1AL': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1AL'], initialState),
                        totalRecords: 2,
                        entityIds: ['P-1', undefined],
                        filterCriteria: 'allTransactions'
                    }
                }
            }
        });

        await storeWithoutDiscardedData.dispatch(subject({numberOfRecordsPerPage: 2, numberOfViewableBillYears}));

        assert.deepEqual(
            url.parse(fetchMock.lastUrl()).query,
            {
                period: 'P5y',
                offset: '1',
                limit: '15',
                filterCriteria: 'C1AL'
            },
            'offset is 1 if there is no discarded data'
        );

        fetchMock.resetHistory();

        const storeWithDiscardedData = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1AL': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1AL'], initialState),
                        totalRecords: 2,
                        discardedCount: 2,
                        entityIds: ['P-1', undefined],
                        filterCriteria: 'C1AL'
                    }
                }
            }
        });

        await storeWithDiscardedData.dispatch(subject({numberOfRecordsPerPage: 2, numberOfViewableBillYears}));

        assert.deepEqual(
            url.parse(fetchMock.lastUrl()).query,
            {
                period: 'P5y',
                offset: '3',
                limit: '15',
                filterCriteria: 'C1AL'
            },
            'offset is calculated correctly by adding discarded count'
        );
    });

    it('sets offset correctly to lowestMissingIndex, if it exists', async () => {
        fetchMock.get(/financialHistory/, 200);

        const storeWithoutMissingData = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1AL': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1AL'], initialState),
                        totalRecords: 2,
                        entityIds: ['P-1', 'B-1'],
                        filterCriteria: 'C1AL'
                    }
                }
            }
        });

        await storeWithoutMissingData.dispatch(subject({numberOfRecordsPerPage: 2, numberOfViewableBillYears}));

        assert.isFalse(fetchMock.called(), 'api is not called because there is no missing data');

        fetchMock.resetHistory();

        const storeWithMissingData = createMockStore({
            ...initialState,
            [namespace]: {
                ...initialState[namespace],
                paginators: {
                    ...get([namespace, 'paginators'], initialState),
                    'ALL_DATES#C1AL': {
                        ...get([namespace, 'paginators', 'ALL_DATES#C1AL'], initialState),
                        totalRecords: 2,
                        entityIds: ['P-1', undefined],
                        filterCriteria: 'C1AL'
                    }
                }
            }
        });

        await storeWithMissingData.dispatch(subject({numberOfRecordsPerPage: 2, numberOfViewableBillYears}));

        assert.strictEqual(fetchMock.calls().length, 1, 'api is called');

        assert.deepEqual(
            url.parse(fetchMock.lastUrl()).query,
            {
                period: 'P5y',
                offset: '1',
                limit: '15',
                filterCriteria: 'C1AL'
            },
            'offset is set to the lowestMissingIndex'
        );
    });
});
