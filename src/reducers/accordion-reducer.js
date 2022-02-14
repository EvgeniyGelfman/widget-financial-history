import getOr from 'lodash/fp/getOr';
import negate from 'lodash/fp/negate';
import {handleAction} from '../namespace';
import {toggleAccordionAction} from '../actions';

const initialState = {};

export const accordionReducer = handleAction(
    toggleAccordionAction,
    (state, {payload}) => {
        const {entityId} = payload;
        const getAccordionState = getOr(false, [entityId]);

        return {
            ...state,
            [entityId]: negate(getAccordionState)(state)
        };
    },
    initialState
);
