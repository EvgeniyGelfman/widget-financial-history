import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import {connect} from 'react-redux';

import {connectConfig} from '@opower/maestro-react';
import {actions as paymentActions} from '@opower/payments-namespace';
import {loadSelectedAccountIfNecessary} from '@opower/account-namespace/actions';
import {queries as accountNamespace} from '@opower/account-namespace';

import {fetchFinancialHistoryIfNecessary} from '../../actions';
import {getState} from '../../namespace';
import {querySelectedPaginator, queryPageNumber, querySelectedPaginatorTransaction} from '../../queries';

import {FinancialHistoryContainerView} from './financial-history-container';

const {fetchScheduledPayments} = paymentActions;
const getPaginatorId = compose(get(['id']), querySelectedPaginator);
const getPaginatorIdTransaction = compose(get(['id']), querySelectedPaginatorTransaction);

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfViewableBillYears: widgetConfig.numberOfViewableBillYears,
    numberOfRecordsPerPage: widgetConfig.numberOfRecordsPerPage
});

export const mapStateToTarget = (globalState, {numberOfViewableBillYears, numberOfRecordsPerPage}) => {
    const state = getState(globalState);

    return {
        selectedAccountId: accountNamespace.selectedAccount.getId(globalState),
        numberOfViewableBillYears,
        numberOfRecordsPerPage,
        pageNumber: queryPageNumber(state),
        paginatorId: getPaginatorId(state),
        paginatorIdTransaction: getPaginatorIdTransaction(state)
    };
};

export const FinancialHistoryContainer = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget, {
        fetchFinancialHistoryIfNecessary,
        loadSelectedAccountIfNecessary,
        fetchScheduledPayments
    })
)(FinancialHistoryContainerView);
