import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';
import noop from 'lodash/fp/noop';

import {namespace} from '../../namespace';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {mapStateToTarget as subject, PaymentRowView} from '.';

const setup = (payment, rowIndex = 1) => {
    return shallow(
        <PaymentRowView
            t={mockTranslate}
            payment={payment}
            rowIndex={rowIndex}
            numberOfDecimalPlaces={2}
            toggleAccordion={noop}
            isOpen
        />
    );
};

describe('Payment - mapStateToTarget', () => {
    it('should return correct response from mapStateToTarget', () => {
        const result = subject({[namespace]: {accordion: {}}}, {payment: {id: 'P-12274411215'}});

        assert.deepEqual(result, {isOpen: false}, 'returns correct response for mapStateToTarget');
    });

    it('should return correct response from mapStateToTarget when accordion has entry for given id', () => {
        const result = subject({[namespace]: {accordion: {'P-12274411215': true}}}, {payment: {id: 'P-12274411215'}});

        assert.deepEqual(result, {isOpen: true}, 'returns correct response for mapStateToTarget');
    });
});

describe('PaymentRowView', () => {
    it('should render payment row and correct message for payment details based on paymentType', () => {
        const payment = {
            id: 'P-2431456106',
            date: '2018-09-23',
            label: 'Payment',
            type: 'P',
            amount: 38,
            currency: '$',
            currencyCode: 'USD',
            billDetails: [],
            billId: null,
            payDetail: {
                confirmationNumber: '06456232103444',
                payEventId: '243143106623',
                paymentId: '2431456106',
                tenderDetails: [
                    {
                        paymentType: '47',
                        paymentTypeDescription: 'CREDITCARD',
                        tenderAmount: 38,
                        cardType: 'C1VS',
                        cardTypeDescription: 'VISA',
                        last4DigitsOfCardNumber: '3832',
                        last4DigitsOfAccountNumber: null,
                        last4DigitsOfRoutingNumber: null,
                        bankName: null
                    }
                ]
            }
        };

        const paymentRowWrapper = setup(payment);

        assert.exists(
            paymentRowWrapper.find('.activity-description').text(),
            'Payment',
            'renders correct activity description for bill'
        );

        assert.strictEqual(
            paymentRowWrapper.find('.activity-date').text(),
            'Sep 23, 2018',
            'renders correct date format (MMM D, YYYY) for a record'
        );

        assert.strictEqual(
            paymentRowWrapper.find('.activity-amount').text(),
            '-$38.00',
            'renders amount correctly with correct currency and two decimal points'
        );

        assert.strictEqual(
            paymentRowWrapper.find('.details-row__value p').first().text(),
            'Visa ending in 3832',
            'renders correct description for payment details'
        );

        assert.strictEqual(
            paymentRowWrapper.find('.details-row__value').last().text(),
            '06456232103444',
            'renders correct confirmation number for payment details'
        );
    });

    it('should render alternate row colors', () => {
        const payment = {
            id: 'P-2431456106',
            date: '2018-09-23',
            label: 'Payment',
            type: 'P',
            amount: 38,
            currency: '$',
            currencyCode: 'USD',
            billDetails: [],
            billId: null,
            payDetail: {
                confirmationNumber: '06456232103444',
                payEventId: '243143106623',
                paymentId: '2431456106',
                tenderDetails: [
                    {
                        paymentType: '47',
                        paymentTypeDescription: 'CREDITCARD',
                        tenderAmount: 38,
                        cardType: 'C1VS',
                        cardTypeDescription: 'VISA',
                        last4DigitsOfCardNumber: '3832',
                        last4DigitsOfAccountNumber: null,
                        last4DigitsOfRoutingNumber: null,
                        bankName: null
                    }
                ]
            }
        };
        let paymentRowWrapper = setup(payment);

        assert.match(
            paymentRowWrapper.html(),
            /payment-row--odd/g,
            'renders correct row color for odd rows'
        );

        paymentRowWrapper = setup(payment, 2);

        assert.match(
            paymentRowWrapper.html(),
            /payment-row--even/g,
            'renders correct row color for even rows'
        );
    });
});
