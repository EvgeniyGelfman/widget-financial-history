import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';

import {querySelectedPaginator} from './query-selected-paginator';

export const queryIsPaginatorFetchSuccessful = compose(get(['isSuccess']), querySelectedPaginator);
