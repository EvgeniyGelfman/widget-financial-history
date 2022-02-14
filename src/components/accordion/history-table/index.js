import allPass from 'lodash/fp/allPass';
import anyPass from 'lodash/fp/anyPass';
import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import gt from 'lodash/fp/gt';
import isEmpty from 'lodash/fp/isEmpty';
import negate from 'lodash/fp/negate';
import rearg from 'lodash/fp/rearg';
import size from 'lodash/fp/size';
import slice from 'lodash/fp/slice';
import eq from 'lodash/fp/eq';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import {connectConfig} from '@opower/maestro-react';
import {queries as paymentQueries} from '@opower/payments-namespace';

import {getState} from '../../namespace';
import {
    queryFinancialHistoryByOffsets,
    queryIsPaginatorEmpty,
    queryShouldShowScheduledPayments,
    queryTotalNumberOfPages
} from '../../queries';
import {
    getHistoryPageBounds,
    getScheduledPaymentsPageBounds,
    isAppInError,
    isFetchingData,
    isHistoryEmpty
} from '../../services';

import {INIT_TRANSACTIONS} from '../../constants';

import {HistoryTableView} from './history-table';

const {queryScheduledPayments} = paymentQueries;

const canShowHistory = negate(isHistoryEmpty);
const getShouldShowScheduledPayments = compose(queryShouldShowScheduledPayments, getState);
const hasNoFilteredHistory = compose(queryIsPaginatorEmpty, getState);

const greaterThan1 = rearg([1, 0], gt)(1);
const getTotalScheduledPayments = compose(size, paymentQueries.queryScheduledPayments, getState);

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfDecimalPlaces: get(['formatConfig', 'numberOfDecimalPlaces'], widgetConfig),
    numberOfRecordsPerPage: widgetConfig.numberOfRecordsPerPage
});

export const mapStateToTarget = (globalState, {numberOfRecordsPerPage}) => {
    const {lowerOffset: lowerOffsetScp, upperOffset: upperOffsetScp} =
        getScheduledPaymentsPageBounds(numberOfRecordsPerPage, globalState);
    const getScheduledPaymentsForCurrentPage =
        compose(slice(lowerOffsetScp, upperOffsetScp), queryScheduledPayments, getState);

    const {lowerOffset, upperOffset} = getHistoryPageBounds(numberOfRecordsPerPage, globalState);

    const isPaginationAvailable = compose(
        greaterThan1,
        queryTotalNumberOfPages({
            numberOfRecordsPerPage,
            shouldShowScheduledPayments: getShouldShowScheduledPayments(globalState),
            numberOfScheduledPayments: getTotalScheduledPayments(globalState)
        }),
        getState
    );

    const getHistory = compose(queryFinancialHistoryByOffsets({lowerOffset, upperOffset}), getState);
    const isFilteredHistoryEmpty = anyPass(
        [
            allPass([
                hasNoFilteredHistory,
                negate(isFetchingData),
                compose(isEmpty, getScheduledPaymentsForCurrentPage)
            ]),
            allPass([
                anyPass([compose(isEmpty, getScheduledPaymentsForCurrentPage),
                    compose(eq('LAST_YEAR_DATES'), get('dateFilter'), getState)]),
                compose(eq(INIT_TRANSACTIONS.PENDING_TRANSACTIONS), get('transactionFilter'), getState)
            ])
        ]);

    return {
        isFetching: isFetchingData(globalState),
        visible: allPass([negate(isAppInError(numberOfRecordsPerPage)), canShowHistory])(globalState),
        shouldShowPagination: isPaginationAvailable(globalState),
        shouldShowNoFilteredData: isFilteredHistoryEmpty(globalState),
        history: getHistory(globalState),
        scheduledPayments: getScheduledPaymentsForCurrentPage(globalState)
    };
};

export const HistoryTable = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget),
    translate()
)(HistoryTableView);
