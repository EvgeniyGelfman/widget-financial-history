import add from 'lodash/fp/add';
import clamp from 'lodash/fp/clamp';
import compose from 'lodash/fp/compose';
import cond from 'lodash/fp/cond';
import constant from 'lodash/fp/constant';
import get from 'lodash/fp/get';
import multiply from 'lodash/fp/multiply';
import size from 'lodash/fp/size';
import stubTrue from 'lodash/fp/stubTrue';

import {queries as paymentQueries} from '@opower/payments-namespace';

import {getState} from '../namespace';
import {queryShouldShowScheduledPayments} from '../queries';

const getTotalScheduledPayments = compose(size, paymentQueries.queryScheduledPayments, getState);
const getPageNumber = compose(get('pageNumber'), getState);
const areScheduledPaymentsShown = compose(queryShouldShowScheduledPayments, getState);

/**
 * Returns the offset of first and last+1 (exclusive) scheduled payment to be displayed on the UI based on
 * current page number.
 * Takes into account the presence or absence of scheduled payments.
 * Result of this function can directly be used in component to display the scheduled payments for a given page.
 * When scheduled payments are not shown, it returns the bounds ass {0, 0}, which should result in an empty scheduled
 * payments records when used with `_.slice`.
 * @param numberOfRecordsPerPage - config property determining how many records we are displaying per page.
 * @param globalState - entire global state containing scheduled payments and financial history
 */
export const getScheduledPaymentsPageBounds = (numberOfRecordsPerPage, globalState) => {
    const totalScheduledPayments = getTotalScheduledPayments(globalState);

    const getCandidateLowerOffset = compose(
        multiply(numberOfRecordsPerPage),
        add(-1), // in FP world, this means subtract 1 from second argument coming later.
        getPageNumber
    ); //takes globalState

    const getCandidateUpperOffset = compose(
        multiply(numberOfRecordsPerPage),
        getPageNumber
    ); //takes globalState

    const restrictWithinBounds = clamp(0, totalScheduledPayments);

    // is inclusive
    const getLowerOffset = cond([
        [areScheduledPaymentsShown, compose(restrictWithinBounds, getCandidateLowerOffset)],
        [stubTrue, constant(0)]
    ]);

    // is exclusive.
    const getUpperOffset = cond([
        [areScheduledPaymentsShown, compose(restrictWithinBounds, getCandidateUpperOffset)],
        [stubTrue, constant(0)]
    ]);

    return {
        lowerOffset: getLowerOffset(globalState),
        upperOffset: getUpperOffset(globalState)
    };
};
