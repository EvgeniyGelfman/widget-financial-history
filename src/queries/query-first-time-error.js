import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';

import {querySelectedPaginator} from './query-selected-paginator';

export const queryFirstTimeError = compose(get('firstTimeError'), querySelectedPaginator);
