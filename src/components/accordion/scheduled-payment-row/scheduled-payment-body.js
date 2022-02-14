import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import get from 'lodash/fp/get';
import map from 'lodash/fp/map';
import negate from 'lodash/fp/negate';
import isEmpty from 'lodash/fp/isEmpty';
import includes from 'lodash/fp/includes';

import {DetailsRow} from './details-row';
import {ScheduledPaymentShape} from './scheduled-payment.shape';
import {CancelPaymentLink} from './cancel-payment-link';

const mapWith = map.convert({cap: false}); // remove 'capping' to support map over key+value
const notEmpty = negate(isEmpty);

const rowClasses = (rowIndex, totalLength) => classnames({
    'details-row--pad-top': rowIndex === 0,
    'details-row--pad-bottom': rowIndex === totalLength - 1
});

const canCancelPayment = (scheduledPayment) => includes(get('status', scheduledPayment), ['SCHEDULED', 'PENDING']);

const renderPaymentBreakdown = (t, scheduledPayment, formatAmount) => {
    const {paymentId, totalAmount, accountPayments} = (scheduledPayment || {});
    const entries = mapWith(({accountId, paymentAmount}, rowIndex, records) => (
        <DetailsRow
            label={t('SCHEDULED_PAYMENT_DETAILS.ACCOUNT',  {accountId})}
            value={formatAmount(t, paymentAmount)}
            key={`${paymentId}-${accountId}`}
            className={rowClasses(rowIndex, records.length)}
        />
    ), accountPayments);

    const totalRow = notEmpty(accountPayments) && (
        <DetailsRow
            label={t('SCHEDULED_PAYMENT_DETAILS.TOTAL')}
            value={formatAmount(t, totalAmount)}
            key={`${paymentId}-total`}
            className="details-row--emphasized details-row--summary"
        />
    );

    return (<React.Fragment>{entries}{totalRow}</React.Fragment>);
};

const renderConfirmationNumberRow = (t, scheduledPayment) => {
    const {confirmationNumber} = scheduledPayment;

    return notEmpty(confirmationNumber) && (
        <DetailsRow
            label={t('PAYMENT_DETAILS.CONFIRMATION')}
            value={confirmationNumber}
            className="details-row-quiet"
        />
    );
};

const renderCancelPaymentRow = (t, scheduledPayment) => {
    const cancellable = canCancelPayment(scheduledPayment);
    const renderLink = () => (<CancelPaymentLink scheduledPayment={scheduledPayment} t={t} />);

    return cancellable && (<DetailsRow label={renderLink()} className="details-link-row" />);
};

export const ScheduledPaymentBody = ({t, formatAmount, isOpen, scheduledPayment, rowIndex}) => {
    const detailsRowClasses = classnames(
        'payment-row__details',
        'details',
        {
            'details--open': isOpen,
            'details--closed': !isOpen
        },
        rowIndex % 2 === 0 ? 'payment-row--even' : 'payment-row--odd'
    );
    const {paymentId} = scheduledPayment;

    /**
     * Follow style of other components in this widget. Table inside table with colspan
     * and conditionally show/hide columns to center content.
     */
    return (
        <tr
            id={`details-${paymentId}`}
            className={detailsRowClasses}
            aria-hidden={!isOpen}
            aria-live="polite"
        >
            <td className="hide-for-small-only" />
            <td colSpan="2" className="details-container">
                <table className="details-table">
                    <tbody>
                        {renderPaymentBreakdown(t, scheduledPayment, formatAmount)}
                        {renderConfirmationNumberRow(t, scheduledPayment)}
                        {renderCancelPaymentRow(t, scheduledPayment)}
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

ScheduledPaymentBody.propTypes = {
    t: PropTypes.func.isRequired,
    formatAmount: PropTypes.func.isRequired,
    rowIndex: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    scheduledPayment: ScheduledPaymentShape.isRequired
};
