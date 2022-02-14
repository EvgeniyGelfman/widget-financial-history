import React from 'react';
import classnames from 'classnames';
import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import isEmpty from 'lodash/fp/isEmpty';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import {opFormatCurrency as currencyFormatter, opFormatDateTime as dateFormatter} from '@opower/javascript-tools';
import {connectConfig} from '@opower/maestro-react';
import {intlLocale} from '@opower/maestro-runtime';

import {Accordion} from '../accordion';
import {toggleAccordionAction as toggleAccordion} from '../../actions';
import {getState} from '../../namespace';
import {queryAccordionStateById} from '../../queries';

import {renderBody} from './render-body';

export const BillRowView = ({t, numberOfDecimalPlaces, isOpen, toggleAccordion, bill, rowIndex}) => {
    if (isEmpty(bill)) {
        return <React.Fragment />;
    }

    return (
        <React.Fragment>
            {renderHeader(t, numberOfDecimalPlaces, isOpen, toggleAccordion, bill, rowIndex)}
            {renderBody(t, numberOfDecimalPlaces, isOpen, bill, rowIndex)}
        </React.Fragment>

    );
};

const renderHeader = (t, numberOfDecimalPlaces, isOpen, toggleAccordion, bill, rowIndex) => {
    const {id: entityId, amount, currencyCode, date} = bill;
    const formattedDate = dateFormatter(t('MOMENT_DATE.SHORT_MONTH_DAY_YEAR'), moment(date).locale(intlLocale));
    const formattedAmount = currencyFormatter(currencyCode, numberOfDecimalPlaces, amount);

    const classes = classnames(
        'activity',
        rowIndex % 2 === 0 ? 'payment-row--even' : 'payment-row--odd'
    );

    return (
        <tr id={bill.id} className={classes}>
            <td className="activity-date indent">
                {formattedDate}
            </td>
            <td className="activity-description">
                <Accordion
                    isOpen={isOpen}
                    entityId={entityId}
                    label={t('HISTORY_TABLE.ACTIVITY.BILL')}
                    toggleAccordion={toggleAccordion}
                />
            </td>
            <td className="activity-amount">
                {formattedAmount}
            </td>
        </tr>
    );
};

BillRowView.propTypes = {
    t: PropTypes.func.isRequired,
    numberOfDecimalPlaces: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    bill: PropTypes.shape({
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
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleAccordion: PropTypes.func.isRequired
};

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfDecimalPlaces: get(['formatConfig', 'numberOfDecimalPlaces'], widgetConfig)
});

export const mapStateToTarget = (globalState, ownProps) => {
    const state = getState(globalState);
    const billId = get(['bill', 'id'])(ownProps);

    return {
        isOpen: queryAccordionStateById(billId)(state)
    };
};

export const BillRow = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget, {toggleAccordion}),
    translate()
)(BillRowView);
