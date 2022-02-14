import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';

import {opFormatCurrency as currencyFormatter} from '@opower/javascript-tools';
import {connectConfig} from '@opower/maestro-react';

import {getState} from '../../namespace';
import {toggleAccordionAction as toggleAccordion} from '../../actions';
import {queryAccordionStateById} from '../../queries';
import {ScheduledPaymentView} from './scheduled-payment-view';

// NOTE: Unlike financial history data, scheduled payment's API response does not receive currency code,
// so we use the message property CURRENCY_CODE as the temporary solution
const createPaymentAmountFormatter = (numberOfDecimalPlaces) => (t, amount) =>
    currencyFormatter(t('CURRENCY.CURRENCY_CODE'), numberOfDecimalPlaces, -1 * amount);

const mapConfigToProps = ({widgetConfig}) => ({
    formatAmount: createPaymentAmountFormatter(get(['formatConfig', 'numberOfDecimalPlaces'], widgetConfig))
});

export const mapStateToTarget = (globalState, ownProps) => {
    const state = getState(globalState);
    const paymentId = get(['scheduledPayment', 'paymentId'])(ownProps);

    return {
        isOpen: queryAccordionStateById(paymentId)(state)
    };
};

export const ScheduledPaymentRow = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget, {toggleAccordion}),
    translate()
)(ScheduledPaymentView);
