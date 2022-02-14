import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/fp/isEmpty';

import {ScheduledPaymentHeader} from './scheduled-payment-header';
import {ScheduledPaymentBody} from './scheduled-payment-body';
import {ScheduledPaymentShape} from './scheduled-payment.shape';

export const ScheduledPaymentView = ({t, formatAmount, isOpen, toggleAccordion, scheduledPayment, rowIndex}) => {
    if (isEmpty(scheduledPayment)) {
        return <React.Fragment />;
    }

    return (
        <React.Fragment>
            <ScheduledPaymentHeader
                t={t}
                formatAmount={formatAmount}
                rowIndex={rowIndex}
                isOpen={isOpen}
                scheduledPayment={scheduledPayment}
                toggleAccordion={toggleAccordion}
            />
            <ScheduledPaymentBody
                t={t}
                formatAmount={formatAmount}
                rowIndex={rowIndex}
                isOpen={isOpen}
                scheduledPayment={scheduledPayment}
            />
        </React.Fragment>
    );
};

ScheduledPaymentView.propTypes = {
    t: PropTypes.func.isRequired,
    formatAmount: PropTypes.func.isRequired,
    rowIndex: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleAccordion: PropTypes.func.isRequired,
    scheduledPayment: ScheduledPaymentShape.isRequired
};
