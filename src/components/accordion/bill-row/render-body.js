import React from 'react';
import classnames from 'classnames';
import curryN from 'lodash/fp/curryN';
import eq from 'lodash/fp/eq';
import map from 'lodash/fp/map';
import size from 'lodash/fp/size';

import {opFormatCurrency as currencyFormatter} from '@opower/javascript-tools';
import {ExperienceLink} from '@opower/maestro-react/experiences';

const mapWith = map.convert({cap: false});

const renderSummary = (t, numberOfDecimalPlaces, bill) => {
    const {amount, billId, currencyCode} = bill;
    const formattedAmount = currencyFormatter(currencyCode, numberOfDecimalPlaces, amount);

    return (
        <React.Fragment>
            <tr className="details-row details-row--emphasized details-row--summary details-row--pad-top">
                <td className="details-row__key">
                    {t('HISTORY_TABLE.ACTIVITY_DETAILS.TOTAL')}
                </td>
                <td className="details-row__value">
                    {formattedAmount}
                </td>
            </tr>
            <tr className="details-link-row">
                <td colSpan="2">
                    <ExperienceLink
                        targetConfigKey="viewBill"
                        className="details-row__view-bill--link"
                        query={{billId}}
                    >
                        {t('VIEW_BILL_DETAILS')}
                    </ExperienceLink>
                </td>
            </tr>
        </React.Fragment>
    );
};

const renderDetails = (numberOfDecimalPlaces, currencyCode, details) => {
    const formatAmount = curryN(3, currencyFormatter)(currencyCode, numberOfDecimalPlaces);

    return mapWith(
        (detail, index, detailsArr) => {
            const rowClasses = classnames(
                'details-row',
                {
                    'details-row--pad-top': eq(0, index),
                    'details-row--pad-bottom': eq(size(detailsArr) - 1, index)
                }
            );

            return (
                <tr className={rowClasses} key={index}>
                    <td className="details-row__key">
                        {detail.label}
                    </td>
                    <td className="details-row__value">
                        {formatAmount(detail.amount)}
                    </td>
                </tr>
            );
        },
        details
    );
};

export const renderBody = (t, numberOfDecimalPlaces, isOpen, bill, rowIndex) => {
    const detailsRowClasses = classnames(
        'bill-row__details',
        'details',
        {
            'details--open': isOpen,
            'details--closed': !isOpen
        },
        rowIndex % 2 === 0 ? 'payment-row--even' : 'payment-row--odd'
    );

    return (
        <tr
            id={`details-${bill.id}`}
            className={detailsRowClasses}
            aria-hidden={!isOpen}
            aria-live="polite"
        >
            <td className="hide-for-small-only" />
            <td colSpan="2" className="details-container">
                <table className="details-table">
                    <tbody>
                        {renderDetails(numberOfDecimalPlaces, bill.currencyCode, bill.billDetails)}
                        {renderSummary(t, numberOfDecimalPlaces, bill)}
                    </tbody>
                </table>
            </td>
        </tr>
    );
};
