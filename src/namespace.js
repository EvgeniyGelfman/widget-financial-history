import {createNamespace} from '@opower/widget-store';

export const {
    createActions,
    createAction,
    handleAction,
    handleActions,
    combineActions,
    registerReducer,
    namespace,
    getState
} = createNamespace('widget-financial-history');
