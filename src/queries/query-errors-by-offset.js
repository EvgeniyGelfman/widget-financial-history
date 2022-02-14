import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import slice from 'lodash/fp/slice';

import {querySelectedPaginator} from './query-selected-paginator';

export const queryErrorsByOffset = ({lowerOffset = 0, upperOffset = 0} = {}) => (state = {}) => {
    return compose(slice(lowerOffset, upperOffset), get('errors'), querySelectedPaginator)(state);
};
