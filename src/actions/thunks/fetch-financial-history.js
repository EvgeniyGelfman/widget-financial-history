/* eslint-disable max-statements */
/* eslint-disable max-len */
import all from 'lodash/fp/all';
import allPass from 'lodash/fp/allPass';
import compose from 'lodash/fp/compose';
import concat from 'lodash/fp/concat';
import eq from 'lodash/fp/eq';
import findIndex from 'lodash/fp/findIndex';
import isEmpty from 'lodash/fp/isEmpty';
import isNil from 'lodash/fp/isNil';
import max from 'lodash/fp/max';
import negate from 'lodash/fp/negate';
import slice from 'lodash/fp/slice';
import set from 'lodash/fp/set';
import reduce from 'lodash/fp/reduce';
import {selectedAccount} from '@opower/account-namespace/queries';

import {getFinancialHistory} from '../../apis';
import {FETCH_BATCH_SIZE as limit, DATE_FILTER_OPTIONS, INIT_TRANSACTIONS} from '../../constants';
import {getState} from '../../namespace';
import {
    queryLookupPeriod,
    queryLookupTransaction,
    querySelectedPaginator
} from '../../queries';
import {getHistoryPageBounds, removeUnwantedFilters} from '../../services';
import {
    receiveFinancialHistoryAction,
    receiveFinancialHistoryErrorAction,
    requestFinancialHistoryAction,
    receiveTransactionFilter,
    setPaginator
} from '..';

export const hasValidIds = allPass([negate(isEmpty), all(negate(isNil))]);

export const fetchFinancialHistoryIfNecessary = ({
    numberOfRecordsPerPage,
    numberOfViewableBillYears
} = {}) => async (dispatch, globalState) => {
    const state = getState(globalState());
    const lookupPeriod = queryLookupPeriod(numberOfViewableBillYears)(state);
    const transactionType = queryLookupTransaction(state);
    const {
        id: selectedPaginator,
        isFetching,
        totalRecords,
        discardedCount,
        entityIds
    } = querySelectedPaginator(state);

    const {lowerOffset, upperOffset} = getHistoryPageBounds(numberOfRecordsPerPage, globalState());

    const getCurrentPageIds = slice(lowerOffset, upperOffset);

    const isEmptyPaginator =  eq(0, totalRecords);
    const hasCachedData = compose(hasValidIds, getCurrentPageIds)(entityIds);

    if (isFetching || isEmptyPaginator || hasCachedData) {
        return;
    }

    const getLowestMissingIndex = compose(max, concat([0]), findIndex(isNil), getCurrentPageIds);

    const offset = discardedCount + lowerOffset + getLowestMissingIndex(entityIds);

    let response;

    const selectedAccountId = selectedAccount.getId(globalState());

    if (!eq(transactionType, INIT_TRANSACTIONS.PENDING_TRANSACTIONS)) {
        dispatch(requestFinancialHistoryAction({selectedPaginator}));

        try {
            response = await getFinancialHistory({
                selectedAccountId,
                period: lookupPeriod,
                filterCriteria: transactionType,
                offset,
                limit
            });
        }
        catch (error) {
            return dispatch(receiveFinancialHistoryErrorAction({
                selectedPaginator,
                error,
                offset,
                limit
            }));
        }

        const getInitialPaginatorSlice = (id) => ({
            id,
            isFetching: false,
            isSuccess: false,
            firstTimeError: null,
            errors: [],
            entityIds: [],
            totalRecords: -1,
            discardedCount: 0
        });

        const getPaginatorDefaultSlice = (state, paginator) => {
            return set(paginator, getInitialPaginatorSlice(paginator), state);
        };

        const filters = removeUnwantedFilters(response.filterCriteriaRecords);

        if (!isEmpty(filters)) {
            const ALL_TRANSACTIONS = {filterType: INIT_TRANSACTIONS.ALL_TRANSACTIONS, filterTypeDescription: 'ALL_TRANSACTIONS'};
            const PENDING_TRANSACTIONS = {filterType: INIT_TRANSACTIONS.PENDING_TRANSACTIONS, filterTypeDescription: 'PENDING_TRANSACTIONS'};
            const updatedTransactionFilterValues = [ALL_TRANSACTIONS, PENDING_TRANSACTIONS, ...filters];
            const TRANSACTION_FILTER_OPTIONS = {};

            dispatch(receiveTransactionFilter({
                filterCriteriaRecords: updatedTransactionFilterValues
            }));

            if (updatedTransactionFilterValues) {
                updatedTransactionFilterValues.forEach((detail) => {
                    TRANSACTION_FILTER_OPTIONS[detail.filterType] = detail.filterType;
                });
            }

            const dateKeys = Object.keys(DATE_FILTER_OPTIONS);
            const transactionKeys = Object.keys(TRANSACTION_FILTER_OPTIONS);

            let FILTER_OPTIONS_OBJ = {};

            dateKeys.forEach((item) => {
                transactionKeys.map((itemT) => {
                    let mapingKey = DATE_FILTER_OPTIONS[item] &&
                        DATE_FILTER_OPTIONS[item].concat('#', TRANSACTION_FILTER_OPTIONS[itemT]);

                    if (Object.keys(state.paginators).indexOf(mapingKey) < 0) {
                        FILTER_OPTIONS_OBJ[mapingKey] = mapingKey;
                    }
                });
            });

            const newState = reduce(getPaginatorDefaultSlice, {}, FILTER_OPTIONS_OBJ);

            dispatch(setPaginator({
                newPaginator: newState
            }));

        }

        return dispatch(receiveFinancialHistoryAction({
            selectedPaginator,
            history: response.history,
            totalRecords: response.totalRecords,
            offset
        }));
    }
};
