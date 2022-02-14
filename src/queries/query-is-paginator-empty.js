import compose from 'lodash/fp/compose';
import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';

import {querySelectedPaginator} from './query-selected-paginator';

export const queryIsPaginatorEmpty = compose(eq(0), get(['totalRecords']), querySelectedPaginator);
