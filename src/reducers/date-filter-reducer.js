import {selectDateFilterAction, resetDateFilterAction} from '../actions';
import {DATE_FILTER_OPTIONS} from '../constants';
import {handleActions} from '../namespace';

const initialState = DATE_FILTER_OPTIONS.ALL_DATES;

/*export const dateFilterReducer = handleAction(
    selectDateFilterAction,
    (state, action) => action.payload.selectedOption,
    initialState
);*/

export const dateFilterReducer = handleActions({
    [selectDateFilterAction]: (state, action) => {
        return action.payload.selectedOption;
    },
    [resetDateFilterAction]: () => {
        return initialState;
    }
}, initialState);
