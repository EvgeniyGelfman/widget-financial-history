import add from 'lodash/fp/add';
import ceil from 'lodash/fp/ceil';
import compose from 'lodash/fp/compose';
import divide from 'lodash/fp/divide';
import get from 'lodash/fp/get';
import rearg from 'lodash/fp/rearg';

import {querySelectedPaginator} from './query-selected-paginator';

const getTotalRecords = compose(get('totalRecords'), querySelectedPaginator);
const divideBy = rearg([1, 0], divide);

export const queryTotalNumberOfPages =
    ({numberOfRecordsPerPage, shouldShowScheduledPayments, numberOfScheduledPayments} = {}) => (state = {}) => {
        const divideByNumberOfRecordsPerPage = divideBy(numberOfRecordsPerPage);
        const withScheduledPayments = add(shouldShowScheduledPayments && numberOfScheduledPayments);

        return compose(ceil, divideByNumberOfRecordsPerPage, withScheduledPayments, getTotalRecords)(state);
    };
