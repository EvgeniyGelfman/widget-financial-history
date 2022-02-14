import PropTypes from 'prop-types';

export const PaymentAmountType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

export const ScheduledPaymentShape = PropTypes.shape({
    paymentId: PropTypes.string.isRequired,
    scheduledDate: PropTypes.string.isRequired,
    totalAmount: PaymentAmountType.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string,
    accountPayments: PropTypes.arrayOf(PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        paymentAmount: PaymentAmountType.isRequired
    }))
});
