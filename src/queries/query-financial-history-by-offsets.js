import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import get from 'lodash/fp/get';
import isEmpty from 'lodash/fp/isEmpty';
import map from 'lodash/fp/map';
import negate from 'lodash/fp/negate';
import slice from 'lodash/fp/slice';

import {querySelectedPaginator} from './query-selected-paginator';

export const queryFinancialHistoryByOffsets = ({lowerOffset = 0, upperOffset = 0} = {}) => (state = {}) => {
    const getEntityIds = compose(slice(lowerOffset, upperOffset), get('entityIds'), querySelectedPaginator);
    const mapIdToEntity = (state) => map((id) => (get(['financialHistory', id])(state)));

    return compose(filter(negate(isEmpty)), mapIdToEntity(state), getEntityIds)(state);
};
