import React from 'react';
import compose from 'lodash/fp/compose';
import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';
import isEmpty from 'lodash/fp/isEmpty';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {intlLocale} from '@opower/maestro-runtime';

import {opFormatCurrency as currencyFormatter, opFormatDateTime as dateFormatter} from '@opower/javascript-tools';
import {connectConfig} from '@opower/maestro-react';

import {Accordion} from '../accordion';
import {toggleAccordionAction as toggleAccordion} from '../../actions';
import {getState} from '../../namespace';
import {queryAccordionStateById} from '../../queries';
import classnames from 'classnames';

import {renderPaymentDetails} from './render-payment-details';

export const PaymentRowView = ({t, numberOfDecimalPlaces, isOpen, toggleAccordion, payment, rowIndex}) => {
    if (isEmpty(payment)) {
        return <React.Fragment />;
    }

    return (
        <React.Fragment>
            {renderHeader(t, numberOfDecimalPlaces, isOpen, toggleAccordion, payment, rowIndex)}
            {renderPaymentDetails(t, isOpen, payment.id, payment.payDetail, rowIndex)}
        </React.Fragment>
    );
};

const renderHeader = (t, numberOfDecimalPlaces, isOpen, toggleAccordion, payment, rowIndex) => {
    const {id: entityId, amount, currencyCode, date, type} = payment;
    const isCancelledPayment = eq(type, 'PX');

    const formattedDate = dateFormatter(t('MOMENT_DATE.SHORT_MONTH_DAY_YEAR'), moment(date).locale(intlLocale));
    const formattedAmount = currencyFormatter(
        currencyCode,
        numberOfDecimalPlaces,
        isCancelledPayment ? amount : -1 * amount
    );
    const typeSuffix = isCancelledPayment ? '_CANCELLED' : '';
    const paymentLabel = t(`HISTORY_TABLE.ACTIVITY.PAYMENT${typeSuffix}`);

    const classes = classnames(
        'activity payment-row',
        rowIndex % 2 === 0 ? 'payment-row--even' : 'payment-row--odd'
    );

    return (
        <tr id={payment.id} className={classes}>
            <td className="activity-date indent">
                {formattedDate}
            </td>
            <td className="activity-description">
                <Accordion isOpen={isOpen} entityId={entityId} label={paymentLabel} toggleAccordion={toggleAccordion} />
            </td>
            <td className="activity-amount">
                {formattedAmount}
            </td>
        </tr>
    );
};

PaymentRowView.propTypes = {
    t: PropTypes.func.isRequired,
    numberOfDecimalPlaces: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    payment: PropTypes.shape({
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
            tenderDetails: PropTypes.arrayOf(PropTypes.shape({
                tenderType: PropTypes.string,
                tenderTypeDescription: PropTypes.string,
                paymentType: PropTypes.string,
                paymentTypeDescription: PropTypes.string,
                tenderAmount: PropTypes.number,
                cardType: PropTypes.string,
                cardTypeDescription: PropTypes.string,
                last4DigitsOfCardNumber: PropTypes.string,
                last4DigitsOfAccountNumber: PropTypes.string,
                last4DigitsOfRoutingNumber: PropTypes.string,
                bankName: PropTypes.string
            }))
        })
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleAccordion: PropTypes.func.isRequired
};

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfDecimalPlaces: get(['formatConfig', 'numberOfDecimalPlaces'], widgetConfig)
});

export const mapStateToTarget = (globalState, ownProps) => {
    const state = getState(globalState);
    const paymentId = get(['payment', 'id'])(ownProps);

    return {
        isOpen: queryAccordionStateById(paymentId)(state)
    };
};

export const PaymentRow = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget, {toggleAccordion}),
    translate()
)(PaymentRowView);
