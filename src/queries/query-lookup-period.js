import getOr from 'lodash/fp/getOr';

import {DATE_FILTER_OPTIONS, DATE_FILTER_PERIODS} from '../constants';

export const queryLookupPeriod = (numberOfViewableBillYears) => (state = {}) => {
    const currentDateFilter = getOr(DATE_FILTER_OPTIONS.ALL_DATES, 'dateFilter')(state);

    return DATE_FILTER_PERIODS[currentDateFilter](numberOfViewableBillYears);
};
