import add from 'lodash/fp/add';
import clamp from 'lodash/fp/clamp';
import compose from 'lodash/fp/compose';
import cond from 'lodash/fp/cond';
import get from 'lodash/fp/get';
import multiply from 'lodash/fp/multiply';
import size from 'lodash/fp/size';
import stubTrue from 'lodash/fp/stubTrue';

import {queries as paymentQueries} from '@opower/payments-namespace';

import {getState} from '../namespace';
import {querySelectedPaginator, queryShouldShowScheduledPayments} from '../queries';

const getTotalScheduledPayments = compose(size, paymentQueries.queryScheduledPayments, getState);
const getPageNumber = compose(get('pageNumber'), getState);
const areScheduledPaymentsShown = compose(queryShouldShowScheduledPayments, getState);
const getTotalRecords = compose(get('totalRecords'), querySelectedPaginator, getState);

/**
 * Returns the offsets of first and last+1 (exclusive) history record to be displayed on the UI based on current
 * page number.
 * Takes into account the presence or absence of scheduled payments and their number.
 * Result of this function can directly be used in component to get the list of history records to be shown.
 * When there are enough scheduled payments to cover an entire page, it returns the bounds as {0, 0}, which should
 * result in an empty history records when used with `_.slice`.
 * @param numberOfRecordsPerPage - config property determining how many records we are displaying per page.
 * @param globalState - entire global state containing scheduled payments and financial history
 */
export const getHistoryPageBounds = (numberOfRecordsPerPage, globalState) => {
    const totalScheduledPayments = getTotalScheduledPayments(globalState);
    const totalRecords = getTotalRecords(globalState);

    const getCandidateLowerOffset = compose(
        multiply(numberOfRecordsPerPage),
        add(-1), // in FP world, this means subtract 1 from second argument coming later.
        getPageNumber
    ); //takes globalState

    const getCandidateUpperOffset = compose(
        multiply(numberOfRecordsPerPage),
        getPageNumber
    ); //takes globalState

    const restrictWithinBounds = clamp(0, totalRecords);

    const countWithSchedulePayments = compose(
        restrictWithinBounds,
        add(-1 * totalScheduledPayments) //subtract the number of scheduled payments from the calculated offset
    );

    // is inclusive
    const getLowerOffset = cond([
        [areScheduledPaymentsShown, compose(countWithSchedulePayments, getCandidateLowerOffset)],
        [stubTrue, compose(restrictWithinBounds, getCandidateLowerOffset)]
    ]);

    // is exclusive
    const getUpperOffset = cond([
        [areScheduledPaymentsShown, compose(countWithSchedulePayments, getCandidateUpperOffset)],
        [stubTrue, compose(restrictWithinBounds, getCandidateUpperOffset)]
    ]);

    return {
        lowerOffset: getLowerOffset(globalState),
        upperOffset: getUpperOffset(globalState)
    };

};
