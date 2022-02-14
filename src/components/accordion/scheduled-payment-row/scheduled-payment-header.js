import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classnames from 'classnames';

import {opFormatDateTime as dateFormatter} from '@opower/javascript-tools';
import {intlLocale} from '@opower/maestro-runtime';

import {Accordion} from '../accordion';
import {ScheduledPaymentShape} from './scheduled-payment.shape';

export const ScheduledPaymentHeader = ({t, formatAmount, isOpen, toggleAccordion, scheduledPayment, rowIndex}) => {
    const {paymentId: id, totalAmount, scheduledDate} = scheduledPayment;
    const formattedDate = dateFormatter(
        t('MOMENT_DATE.SHORT_MONTH_DAY_YEAR'),
        moment(scheduledDate).locale(intlLocale)
    );
    const paymentLabel = t('HISTORY_TABLE.ACTIVITY.SCHEDULED');
    const accordionEntityId = String(id); // we may receive number instead of string here

    const classes = classnames(
        'activity activity--processing scheduled-payment-row',
        rowIndex % 2 === 0 ? 'payment-row--even' : 'payment-row--odd'
    );

    return (
        <tr id={accordionEntityId} className={classes}>
            <td className="activity-date indent">
                {formattedDate}
            </td>
            <td className="activity-description">
                <Accordion
                    isOpen={isOpen}
                    entityId={accordionEntityId}
                    label={paymentLabel}
                    toggleAccordion={toggleAccordion}
                />
            </td>
            <td className="activity-amount">
                {formatAmount(t, totalAmount)}
            </td>
        </tr>
    );
};

ScheduledPaymentHeader.propTypes = {
    t: PropTypes.func.isRequired,
    formatAmount: PropTypes.func.isRequired,
    rowIndex: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleAccordion: PropTypes.func.isRequired,
    scheduledPayment: ScheduledPaymentShape.isRequired
};
