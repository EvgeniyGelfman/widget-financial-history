import allPass from 'lodash/fp/allPass';
import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import negate from 'lodash/fp/negate';
import isEmpty from 'lodash/fp/isEmpty';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import {connectConfig} from '@opower/maestro-react';

import {selectTransactionFilterAction as selectTransactionFilter} from '../../actions';
import {getState} from '../../namespace';
import {querySelectedPaginator} from '../../queries';
import {isAppInError, isHistoryEmpty} from '../../services';

import {TransactionFilterView} from './transaction-filter';

const getSelectedPaginator = compose(get('id'), querySelectedPaginator, getState);
const canShowSelector = negate(isHistoryEmpty);

export const mapStateToTarget = (globalState, {numberOfRecordsPerPage}) => {
    const state = getState(globalState);
    const paginator = getSelectedPaginator(globalState);
    const transactionFilter = paginator.split('#')[1];
    const transactionFilterValues = get(['transactionFilterValues'], state);

    return {
        currentFilter: paginator && transactionFilter,
        visible: allPass([negate(isAppInError(numberOfRecordsPerPage)), canShowSelector])(globalState) &&
            !isEmpty(transactionFilterValues),
        filterValues: transactionFilterValues
    };
};

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfRecordsPerPage: widgetConfig.numberOfRecordsPerPage
});

export const TransactionFilter = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget, {selectTransactionFilter}),
    translate()
)(TransactionFilterView);
