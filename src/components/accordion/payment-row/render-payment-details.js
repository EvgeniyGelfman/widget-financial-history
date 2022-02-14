import React from 'react';
import classnames from 'classnames';
import map from 'lodash/fp/map';
import uniqueId from 'lodash/fp/uniqueId';

const getPaymentDetailsDescription = (t, detail) => {
    return map(method => {
        const cardType = t(`PAYMENT_DETAILS.CARD_TYPE.${method.cardType}`);

        return (
            <p key={uniqueId()}>{t([
                `PAYMENT_DETAILS.PAYMENT_METHOD.${method.paymentType}`,
                method.tenderTypeDescription
            ], {...method, cardType})}
            </p>
        );
    })(detail.tenderDetails);
};

const renderPaymentDetailRow = (t, detail) => {
    const paymentDetailsDescription = getPaymentDetailsDescription(t, detail);

    return (
        <React.Fragment>
            <tr className="details-row details-row__payments details-row--stacked-mobile details-row--pad-top
                           details-row--quiet"
            >
                <td className="details-row__key">
                    {t('PAYMENT_DETAILS.METHOD')}
                </td>
                <td className="details-row__value">
                    {paymentDetailsDescription}
                </td>
            </tr>
            <tr className="details-row
                details-row--stacked-mobile
                details-row--pad-top
                details-row--quiet
                details-row--confirmation"
            >
                <td className="details-row__key">
                    <pre className="no-wrap">{t('PAYMENT_DETAILS.CONFIRMATION')}</pre>
                </td>
                <td className="details-row__value small-top-padding">
                    {detail.confirmationNumber}
                </td>
            </tr>
        </React.Fragment>
    );
};

export const renderPaymentDetails = (t, isOpen, id, paymentDetail, rowIndex) => {
    const detailsRowClasses = classnames(
        'payment-row__details',
        'details',
        {
            'details--open': isOpen,
            'details--closed': !isOpen
        },
        rowIndex % 2 === 0 ? 'payment-row--even' : 'payment-row--odd'
    );

    return (
        <tr
            key={id}
            id={`details-${id}`}
            className={detailsRowClasses}
            aria-hidden={!isOpen}
            aria-live="polite"
        >
            <td className="hide-for-small-only" />
            <td colSpan="2" className="details-container">
                <table className="details-table">
                    <tbody>
                        {renderPaymentDetailRow(t, paymentDetail)}
                    </tbody>
                </table>
            </td>
        </tr>
    );
};
