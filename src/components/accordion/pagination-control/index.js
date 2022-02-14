import allPass from 'lodash/fp/allPass';
import anyPass from 'lodash/fp/anyPass';
import compose from 'lodash/fp/compose';
import gt from 'lodash/fp/gt';
import negate from 'lodash/fp/negate';
import rearg from 'lodash/fp/rearg';
import size from 'lodash/fp/size';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import {connectConfig} from '@opower/maestro-react';
import {queries as paymentQueries} from '@opower/payments-namespace';

import {goToNextPageAction as goToNextPage, goToPreviousPageAction as goToPreviousPage} from '../../actions';
import {getState} from '../../namespace';
import {
    queryIsPaginatorFetching,
    queryPageNumber,
    queryShouldShowScheduledPayments,
    queryTotalNumberOfPages
} from '../../queries';
import {isAppInError} from '../../services';

import {PaginationControlView} from './pagination-control';

const {queryScheduledPayments, queryIsFetchingScheduledPayments} = paymentQueries;
const greaterThan1 = rearg([1, 0], gt)(1);
const getTotalScheduledPayments = compose(size, queryScheduledPayments, getState);

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfRecordsPerPage: widgetConfig.numberOfRecordsPerPage
});

const mapStateToTarget = (globalState, {numberOfRecordsPerPage}) => {
    const state = getState(globalState);
    const getTotalPages = compose(
        queryTotalNumberOfPages({
            numberOfRecordsPerPage,
            shouldShowScheduledPayments: queryShouldShowScheduledPayments(state),
            numberOfScheduledPayments: getTotalScheduledPayments(globalState)
        }),
        getState
    );

    const isFetchingData = anyPass([
        compose(queryIsFetchingScheduledPayments, getState),
        compose(queryIsPaginatorFetching, getState)
    ]);

    const notInError = negate(isAppInError(numberOfRecordsPerPage));

    return {
        visible: allPass([notInError, compose(greaterThan1, getTotalPages)])(globalState),
        isFetching: isFetchingData(globalState),
        pageNumber: queryPageNumber(state),
        totalPages: getTotalPages(globalState)
    };
};

export const PaginationControl = compose(
    translate(),
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget, {goToNextPage, goToPreviousPage})
)(PaginationControlView);
