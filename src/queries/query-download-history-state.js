import compose from 'lodash/fp/compose';
import getOr from 'lodash/fp/getOr';
import {getState} from '../namespace';

export const isFetchingHistoryReport = compose(getOr(false, ['downloadHistory', 'isLoading']), getState);
