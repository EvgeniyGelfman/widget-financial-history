import React from 'react';
import {Button} from 'opattern-react/button';
import PropTypes from 'prop-types';
import compose from 'lodash/fp/compose';
import {connect} from 'react-redux';
import negate from 'lodash/fp/negate';
import allPass from 'lodash/fp/allPass';
import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';
import isEmpty from 'lodash/fp/isEmpty';

import {DateFilter} from '../date-filter';
import {TransactionFilter} from '../transaction-filter';
import {translate} from 'react-i18next';
import {
    resetDateFilterAction as resetDateFilter,
    resetTransactionFilterAction as resetTransactionFilter,
    resetFilterAction as resetFilter,
    resetFinancialHistoryAction as resetFinancialHistory
} from '../../actions';
import {isAppInError, isHistoryEmpty} from '../../services';
import {getState} from '../../namespace';

const canShowSelector = negate(isHistoryEmpty);

const FilterView = ({
    t,
    resetDateFilter,
    resetTransactionFilter,
    resetFilter,
    resetFinancialHistory,
    visible,
    showClear,
    disableClear,
    initTransactionVal
}) => {
    const resetFilters = () => {
        if (!disableClear) {
            resetDateFilter();
            resetTransactionFilter({initTransactionVal});
            resetFilter();
            resetFinancialHistory();
        }
    };

    return visible && (
        <div className="filterWrapper">
            <TransactionFilter />
            <DateFilter />

            {showClear && (
                <Button
                    variant={disableClear ? 'disabled' : 'alternate'}
                    onClick={resetFilters}
                    aria-label={t(`FILTER.A11Y.LABEL.CLEAR`)}
                >
                    {t(`FILTER.A11Y.LABEL.CLEAR`)}
                </Button>
            )}
        </div>
    );
};

export const mapStateToTarget = (globalState, {numberOfRecordsPerPage}) => {
    const state = getState(globalState);
    const transactionFilterValue = compose(get(['transactionFilterValues', ...[].concat(0)]))(state);

    return {
        visible: allPass([negate(isAppInError(numberOfRecordsPerPage)), canShowSelector])(globalState),
        initTransactionVal: transactionFilterValue && transactionFilterValue.filterType,
        showClear: !isEmpty(get(['transactionFilterValues'], state)),
        disableClear: isEmpty(get(['transactionFilter'], state)) && eq('ALL_DATES', get(['dateFilter'], state))
    };
};

FilterView.propTypes = {
    /**
     * Translate function
     */
    t: PropTypes.func.isRequired,
    resetDateFilter: PropTypes.func.isRequired,
    resetTransactionFilter: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    resetFinancialHistory: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    showClear: PropTypes.bool.isRequired,
    disableClear: PropTypes.bool.isRequired,
    initTransactionVal: PropTypes.string
};

FilterView.defaultProps = {
    initTransactionVal: ''
};

export const Filter = compose(
    connect(mapStateToTarget, {resetDateFilter, resetTransactionFilter, resetFilter, resetFinancialHistory}),
    translate()
)(FilterView);
