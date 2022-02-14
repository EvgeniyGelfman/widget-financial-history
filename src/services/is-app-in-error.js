import anyPass from 'lodash/fp/anyPass';
import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import isEmpty from 'lodash/fp/isEmpty';
import isNil from 'lodash/fp/isNil';
import negate from 'lodash/fp/negate';

import {getState} from '../namespace';
import {queryErrorsByOffset, queryFirstTimeError} from '../queries';

import {getHistoryPageBounds} from './get-history-page-bounds';

export const isAppInError = (numberOfRecordsPerPage) => (globalState) => {
    const {lowerOffset, upperOffset} = getHistoryPageBounds(numberOfRecordsPerPage, globalState);

    const hasErrorsInCurrentPage = compose(
        negate(isEmpty),
        filter(negate(isEmpty)),
        queryErrorsByOffset({lowerOffset, upperOffset}),
        getState
    );

    const hasFirstTimeError = compose(negate(isNil), queryFirstTimeError, getState);

    return anyPass([hasFirstTimeError, hasErrorsInCurrentPage])(globalState);
};
