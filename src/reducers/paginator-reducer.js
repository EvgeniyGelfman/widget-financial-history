/* eslint-disable max-statements */
/* eslint-disable max-len */
import constant from 'lodash/fp/constant';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import min from 'lodash/fp/min';
import reduce from 'lodash/fp/reduce';
import set from 'lodash/fp/set';
import size from 'lodash/fp/size';
import slice from 'lodash/fp/slice';
import times from 'lodash/fp/times';

import {
    receiveFinancialHistoryAction,
    receiveFinancialHistoryErrorAction,
    requestFinancialHistoryAction,
    resetFinancialHistoryAction,
    receiveTransactionFilter,
    setPaginator
} from '../actions';

import {DATE_FILTER_OPTIONS} from '../constants';
import {filterUnwantedHistory, normalizeHistory} from '../services';
import {handleActions} from '../namespace';

const getArrayOfUndefined = times(() => undefined);

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

let filterCriteriaRecords;

const handleReceiveTransactionFilter = (state, action) => {
    filterCriteriaRecords = action.payload.filterCriteriaRecords;

    return {
        ...state,
        filterCriteriaRecords
    };
};

const getPaginatorDefaultSlice = (state, paginator) => {
    return set(paginator, getInitialPaginatorSlice(paginator), state);
};

const filterOptionsSet = () => {
    return {...DATE_FILTER_OPTIONS};
};

let initialState = reduce(getPaginatorDefaultSlice, {}, filterOptionsSet());

const handleReceiveFinancialHistoryAction = (state, action) => {
    const {selectedPaginator, history, offset = 0, totalRecords} = action.payload;

    const normalizedRecords = normalizeHistory(filterUnwantedHistory(history));

    // We only get total records from the server when offset = 0
    const recordsCount = offset === 0 ? totalRecords : get([selectedPaginator, 'totalRecords'], state);

    // records which are not payment or bill types are discarded
    // Initial state will have 0 discarded records.
    const discardedCount = offset === 0 ? 0 : get([selectedPaginator, 'discardedCount'], state);

    // if we had previously discarded records, adjust the offset coming from the action
    // action needs the offset including the discarded records since server doesn't know anything about discarded
    // records. Reducer however doesn't need that offset, so it needs to adjust it again.
    const trueOffset = offset === 0 ? offset : offset - discardedCount;

    // total records should be adjusted for the number of entries we discarded in this pass.
    const actualRecordsCount = recordsCount - (size(history) - size(normalizedRecords.result));
    const newDiscardedCount =  discardedCount + (recordsCount - actualRecordsCount);

    // We may receive less than `limit` records e.g. total results in first call were less than limit
    // or with given batchSize, the last page has fewer records than the limit. So use the size of received records
    // rather than `limit`
    const newEntityIds = normalizedRecords.result;
    const numberOfRecordsReceived = size(normalizedRecords.result);

    // Assumptions is that `discardable` records would only be present in "first" page.
    const existingEntityIds =
        trueOffset === 0 ? getArrayOfUndefined(actualRecordsCount) : get([selectedPaginator, 'entityIds'], state);
    const existingIdsAtStart = slice(0, trueOffset, existingEntityIds);
    const existingIdsAtEnd = slice(trueOffset + numberOfRecordsReceived, actualRecordsCount, existingEntityIds);

    // either initialize errors array, or reset them in existing errors array if we had received error for
    // given page previously.
    const existingErrors =
        trueOffset === 0 ? getArrayOfUndefined(actualRecordsCount) : get([selectedPaginator, 'errors'], state);
    const existingErrorsAtStart = slice(0, trueOffset, existingErrors);
    const existingErrorsAtEnd = slice(trueOffset + numberOfRecordsReceived, actualRecordsCount, existingErrors);
    const resetErrors = getArrayOfUndefined(numberOfRecordsReceived);

    return {
        ...state,
        [selectedPaginator]: {
            id: selectedPaginator,
            isFetching: false,
            isSuccess: true,
            entityIds: [...existingIdsAtStart, ...newEntityIds, ...existingIdsAtEnd],
            totalRecords: actualRecordsCount,
            discardedCount: newDiscardedCount,
            errors: [...existingErrorsAtStart, ...resetErrors, ...existingErrorsAtEnd],
            firstTimeError: null
        }
    };
};

const handleReceiveFinancialHistoryErrorAction = (state, action) => {
    const {selectedPaginator, error, offset = 0, limit} = action.payload;

    // TODO: We may have to change our error handling strategy once we have pagination in place
    // where we may get error for one of the page but other pages (previous at least) are fetched correctly
    // and so in that case, the MOVE PREVIOUS action should reset the `error` once it is displayed on the UI
    // for current page and user clicks `previous arrow`

    const errorString = getOr(get('message', error), 'details', error);

    if (offset === 0) {
        // We still don't know how many records there could be :-(
        // Also, if we received error for first page, overwrite the previous state.
        return {
            ...state,
            [selectedPaginator]:
                {
                    ...getInitialPaginatorSlice(selectedPaginator),
                    isFetching: false,
                    isSuccess: false,
                    firstTimeError: errorString
                }
        };
    }

    const {totalRecords, errors: existingErrors, discardedCount} = get([selectedPaginator], state);
    // if we had previously discarded records, adjust the offset coming from the action
    // action needs the offset including the discarded records since server doesn't know anything about discarded
    // records. Reducer however doesn't need that offset, so it needs to adjust it again.
    const trueOffset = offset - discardedCount;

    // Last page may contain less records than limit.
    // So, we should only store up to `totalRecords` errors.
    const newLimit = min([limit, totalRecords - trueOffset]);
    const newErrors = times(constant(errorString), newLimit);

    const existingErrorsAtStart = slice(0, trueOffset, existingErrors);
    const existingErrorsAtEnd = slice(trueOffset + newLimit, totalRecords, existingErrors);

    const actualErrors = [...existingErrorsAtStart, ...newErrors, ...existingErrorsAtEnd];

    return {
        ...state,
        [selectedPaginator]: {
            ...state[selectedPaginator],
            isFetching: false,
            errors: actualErrors
        }
    };
};

export const paginatorReducer = handleActions({
    [requestFinancialHistoryAction]: (state, action) => {
        const {selectedPaginator} = action.payload;

        return {
            ...state,
            [selectedPaginator]: {
                ...state[selectedPaginator],
                isFetching: true
            }
        };
    },
    [receiveFinancialHistoryErrorAction]: handleReceiveFinancialHistoryErrorAction,
    [receiveFinancialHistoryAction]: handleReceiveFinancialHistoryAction,
    [receiveTransactionFilter]: handleReceiveTransactionFilter,
    [setPaginator]: (state, action) => {
        const {newPaginator} = action.payload;

        return {
            ...state,
            ...newPaginator
        };
    },
    [resetFinancialHistoryAction]: (state) => {
        return {
            ...state
        };
    }
}, initialState);
