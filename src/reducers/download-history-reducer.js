import {
    fetchHistoryError,
    fetchHistoryStarted,
    fetchHistorySuccess
} from '../actions/action-creators';
import {handleActions} from '../namespace';

const initialState = {
    isLoading: false,
    error: null,
    isSuccess: false
};

export const downloadHistoryReducer = handleActions({
    [fetchHistoryStarted]: () => ({
        ...initialState,
        isLoading: true
    }),
    [fetchHistorySuccess]: () => ({
        isLoading: false,
        isSuccess: true,
        error: null
    }),
    [fetchHistoryError]: (state, {payload: error}) => ({
        ...initialState,
        ...state,
        error,
        isLoading: false,
        isSuccess: false
    })
}, initialState);
