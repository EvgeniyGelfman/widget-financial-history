import {receiveTransactionFilter} from '../actions';
import {handleAction} from '../namespace';

const initialState = {};

export const transactionFilterValuesReducer = handleAction(
    receiveTransactionFilter,
    (state, action) => {
        const {filterCriteriaRecords} = action.payload;

        return {...state, ...filterCriteriaRecords};
    },
    initialState
);
