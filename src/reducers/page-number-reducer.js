import clamp from 'lodash/fp/clamp';

import {
    goToNextPageAction as goToNextPage,
    goToPreviousPageAction as goToPreviousPage,
    selectDateFilterAction,
    selectTransactionFilterAction,
    resetFilterAction
} from '../actions';
import {handleActions} from '../namespace';

const initialState = 1;

export const pageNumberReducer = handleActions({
    [goToNextPage]: (state, action) => {
        const {totalPages} = action.payload;

        return clamp(1, totalPages, state + 1);
    },
    [goToPreviousPage]: (state, action) => {
        const {totalPages} = action.payload;

        return clamp(1, totalPages, state - 1);
    },
    [selectDateFilterAction]: () => {
        // When date filtering changes, reset to first page
        return initialState;
    },
    [selectTransactionFilterAction]: () => {
        // When date filtering changes, reset to first page
        return initialState;
    },
    [resetFilterAction]: () => {
        return initialState;
    }
}, initialState);
