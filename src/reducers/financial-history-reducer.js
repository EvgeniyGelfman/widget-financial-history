import {receiveFinancialHistoryAction} from '../actions';
import {filterUnwantedHistory, normalizeHistory} from '../services';
import {handleAction} from '../namespace';

const initialState = {};

export const financialHistoryReducer = handleAction(
    receiveFinancialHistoryAction,
    (state, action) => {

        const {history} = action.payload;

        // Since CC&B sends pre-formatted date string, we will convert them to moment object as and when needed
        // for any date calculations, with a timezoneId of `UTC` as we don't get timezoneId from the backend/CC&B

        const normalizedRecords = normalizeHistory(filterUnwantedHistory(history));

        return {...state, ...normalizedRecords.entities.history};
    },
    initialState
);
