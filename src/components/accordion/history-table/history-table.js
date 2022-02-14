import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/fp/isEmpty';
import map from 'lodash/fp/map';
import negate from 'lodash/fp/negate';
import PropTypes from 'prop-types';

import {Spinner} from '@opower/dss-react-components/spinner';

import {BillRow} from '../bill-row';
import {PaymentRow} from '../payment-row';
import {ScheduledPaymentRow} from '../scheduled-payment-row';
import {ScheduledPaymentShape} from '../scheduled-payment-row/scheduled-payment.shape';

const renderHistory = (history, rowIndex) => {
    return history.map(
        (row) => {
            if (row.type === 'C' || negate(isEmpty)(row.billId)) {
                rowIndex = rowIndex + 1;

                return (
                    <BillRow key={row.id} rowIndex={rowIndex} bill={row} />
                );
            } else if (row.type === 'P' || row.type === 'PX') {
                rowIndex = rowIndex + 1;

                return (
                    <PaymentRow payment={row} rowIndex={rowIndex} key={row.id} />
                );
            } else {
                return null;
            }
        }
    );
};

const renderScheduledPayments = (scheduledPayments, rowIndex)  => {
    const rows = map(
        (row) => {
            rowIndex = rowIndex + 1;

            return (
                <ScheduledPaymentRow rowIndex={rowIndex} scheduledPayment={row} key={row.id} />
            );
        },
        scheduledPayments
    );

    return [rows, rowIndex];
};

const renderPaymentHistory = (scheduledPayments, history, rowIndex) => {
    const [rows, updatedRowIndex] = renderScheduledPayments(scheduledPayments, rowIndex);

    return {
        scheduled: rows,
        payments: renderHistory(history, updatedRowIndex)
    };
};

const renderSpinner = (t) => {
    return (
        <tr>
            <td colSpan="3">
                <div className="spinner-wrapper">
                    <Spinner messagePrefix="LABEL" visible t={t} />
                </div>
            </td>
        </tr>
    );
};

export const HistoryTableView = ({
    t,
    scheduledPayments,
    history,
    shouldShowPagination,
    isFetching,
    shouldShowNoFilteredData,
    visible
}) => {
    if (!visible) {
        return <React.Fragment />;
    }

    let rowIndex = 0;

    const paymentRows = renderPaymentHistory(scheduledPayments, history, rowIndex);

    //TODO: DSS-4594 : show a different message when data does not exist for given selectors
    if (shouldShowNoFilteredData) {
        return (
            <div className="no-data-container">
                <h1 className="display-smallest">
                    {t('HISTORY_TABLE.NO_DATA')}
                </h1>
            </div>
        );
    }

    return (
        <table
            id="history_table"
            className={classnames('history__table', {'history__table--collapsed-margin': shouldShowPagination})}
            role="region"
            aria-live="polite"
            summary={t('HISTORY_TABLE.A11Y.SUMMARY')}
        >
            <thead>
                <tr>
                    <th scope="col" className="indent">
                        {t('HISTORY_TABLE.HEADER.DATE')}
                    </th>
                    <th scope="col" className="middle">
                        {t('HISTORY_TABLE.HEADER.ACTIVITY')}
                    </th>
                    <th scope="col" className="last">
                        {t('HISTORY_TABLE.HEADER.AMOUNT')}
                    </th>
                </tr>
            </thead>
            <tbody>
                {isFetching && renderSpinner(t)}
                {!isFetching && paymentRows.scheduled}
                {!isFetching && paymentRows.payments}
            </tbody>
        </table>
    );
};

HistoryTableView.propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.arrayOf(PropTypes.oneOfType([
        // Payment
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            date: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            currency: PropTypes.string.isRequired,
            currencyCode: PropTypes.string.isRequired,
            payDetail: PropTypes.shape({
                confirmationNumber: PropTypes.string,
                payEventId: PropTypes.string,
                paymentId: PropTypes.string,
                paymentType: PropTypes.string,
                paymentTypeDescription: PropTypes.string,
                tenderAmount: PropTypes.number,
                cardType: PropTypes.string,
                cardTypeDescription: PropTypes.string,
                last4DigitsOfCardNumber: PropTypes.string,
                last4DigitsOfAccountNumber: PropTypes.string,
                last4DigitsOfRoutingNumber: PropTypes.string,
                bankName: PropTypes.string
            })
        }),
        // Or Bill
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            date: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            currency: PropTypes.string.isRequired,
            currencyCode: PropTypes.string.isRequired,
            billId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            billDetails: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.string.isRequired,
                amount: PropTypes.number.isRequired,
                currency: PropTypes.string.isRequired
            }))
        })
    ])).isRequired,
    scheduledPayments: PropTypes.arrayOf(ScheduledPaymentShape).isRequired,
    isFetching: PropTypes.bool.isRequired,
    shouldShowPagination: PropTypes.bool.isRequired,
    shouldShowNoFilteredData: PropTypes.bool.isRequired,
    visible: PropTypes.bool
};

HistoryTableView.defaultProps = {
    visible: false
};
