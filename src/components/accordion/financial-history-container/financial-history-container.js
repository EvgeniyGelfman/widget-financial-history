import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import {Layout} from '../layout';
import {useDispatch} from 'react-redux';
import {resetWidgetState} from '../../actions/action-creators';

export const FinancialHistoryContainerView = ({
    selectedAccountId,
    numberOfRecordsPerPage,
    numberOfViewableBillYears,
    paginatorId,
    paginatorIdTransaction,
    pageNumber,
    fetchFinancialHistoryIfNecessary,
    fetchScheduledPayments,
    loadSelectedAccountIfNecessary
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        loadSelectedAccountIfNecessary();
    }, []);

    /**
     * Contains side effects that should be executed after account is changed or account is set for the first time.
     */
    useEffect(() => {
        if (selectedAccountId) {
            fetchScheduledPayments(selectedAccountId);
        }

        /**
         * Important: clean up logic that is triggered whenever widget is unmounted or account is changed.
         * It especially crucial when widget is part of single page application, as we need to reset its state
         * once widget is hidden.
         *
         * Without cleaning the state on account change, we might have some state slices related to
         * different account that is obviously would be a bug.
         */
        return () => dispatch(resetWidgetState());
    }, [selectedAccountId]);

    useEffect(() => {
        if (selectedAccountId) {
            fetchFinancialHistoryIfNecessary({numberOfRecordsPerPage, numberOfViewableBillYears});
        }
    },
    [selectedAccountId, paginatorId, paginatorIdTransaction, pageNumber]
    );

    return <Layout />;
};

FinancialHistoryContainerView.propTypes = {
    selectedAccountId: PropTypes.string,
    numberOfViewableBillYears: PropTypes.number.isRequired,
    numberOfRecordsPerPage: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    paginatorId: PropTypes.string.isRequired,
    paginatorIdTransaction: PropTypes.string,
    fetchFinancialHistoryIfNecessary: PropTypes.func.isRequired,
    fetchScheduledPayments: PropTypes.func.isRequired,
    loadSelectedAccountIfNecessary: PropTypes.func.isRequired
};

FinancialHistoryContainerView.defaultProps = {
    selectedAccountId: undefined,
    paginatorIdTransaction: ''
};
