import {selectTransactionFilterAction, resetTransactionFilterAction} from '../actions';
import {handleActions} from '../namespace';

const initialState = '';

export const transactionFilterReducer = handleActions({
    [selectTransactionFilterAction]: (state, action) => {
        return action.payload.selectedOption;
    },
    [resetTransactionFilterAction]: (state, action) => {
        return action.payload.initTransactionVal;
    }
}, initialState);
