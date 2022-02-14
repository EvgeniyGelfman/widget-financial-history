import {assert} from 'chai';

import {receiveFinancialHistoryAction} from '../actions';

import {financialHistoryReducer as subject} from './financial-history-reducer';

describe('financialHistoryReducer', () => {

    it('returns initial state when undefined state is passed', () => {
        const state = subject(undefined, {});

        assert.deepEqual(
            state,
            {},
            'initial state is returned when undefined state is passed'
        );
    });

    it('handles the receive financial history action correctly', () => {
        const history = [{
            date: '2017-04-26',
            label: 'Bill',
            type: 'C',
            amount: -111.5,
            currency: '$',
            currencyCode: 'USD',
            billId: '243143106',
            details: [],
            payDetail: null
        }, {
            date: '2013-09-14',
            label: 'PAYMENT',
            type: 'P',
            amount: 535.13,
            currency: '$',
            currencyCode: 'USD',
            billId: null,
            details: [],
            payDetail: {
                confirmationNumber: '06456306103018',
                payEventId: '243143106623',
                paymentId: '243143106',
                paymentType: '47',
                paymentTypeDescription: 'CREDITCARD',
                tenderAmount: '535.13',
                cardType: 'C1VS',
                cardTypeDescription: 'VISA',
                last4DigitsOfCardNumber: '3832',
                last4DigitsOfAccountNumber: null,
                last4DigitsOfRoutingNumber: null,
                bankName: null
            }
        }];
        const state = subject(
            {},
            receiveFinancialHistoryAction({history})
        );

        assert.deepEqual(
            state,
            {
                'B-243143106': {
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: '243143106',
                    id: 'B-243143106',
                    details: [],
                    payDetail: null
                },
                'P-243143106': {
                    date: '2013-09-14',
                    label: 'PAYMENT',
                    type: 'P',
                    amount: 535.13,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: null,
                    id: 'P-243143106',
                    details: [],
                    payDetail: {
                        confirmationNumber: '06456306103018',
                        payEventId: '243143106623',
                        paymentId: '243143106',
                        paymentType: '47',
                        paymentTypeDescription: 'CREDITCARD',
                        tenderAmount: '535.13',
                        cardType: 'C1VS',
                        cardTypeDescription: 'VISA',
                        last4DigitsOfCardNumber: '3832',
                        last4DigitsOfAccountNumber: null,
                        last4DigitsOfRoutingNumber: null,
                        bankName: null
                    }
                }
            }
        );
    });

    it('handles receive financial history action with an empty history', () => {
        const state = subject(
            {
                'B-243143106': {
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: '243143106',
                    id: 'B-243143106',
                    details: [],
                    payDetail: null
                }
            },
            receiveFinancialHistoryAction({history: []})
        );

        assert.deepEqual(
            state,
            {
                'B-243143106': {
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: '243143106',
                    id: 'B-243143106',
                    details: [],
                    payDetail: null
                }
            }
        );
    });

    it('merges the states correctly while receiving history action with previous state', () => {
        const history = [{
            date: '2013-09-14',
            label: 'PAYMENT',
            type: 'P',
            amount: 535.13,
            currency: '$',
            currencyCode: 'USD',
            billId: null,
            details: [],
            payDetail: {
                confirmationNumber: '06456306103018',
                payEventId: '243143106623',
                paymentId: '243143106',
                paymentType: '47',
                paymentTypeDescription: 'CREDITCARD',
                tenderAmount: '535.13',
                cardType: 'C1VS',
                cardTypeDescription: 'VISA',
                last4DigitsOfCardNumber: '3832',
                last4DigitsOfAccountNumber: null,
                last4DigitsOfRoutingNumber: null,
                bankName: null
            }
        }];

        const state = subject(
            {
                'B-243143106': {
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: '243143106',
                    id: 'B-243143106',
                    details: [],
                    payDetail: null
                }
            },
            receiveFinancialHistoryAction({history})
        );

        assert.deepEqual(
            state,
            {
                'B-243143106': {
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: '243143106',
                    id: 'B-243143106',
                    details: [],
                    payDetail: null
                },
                'P-243143106': {
                    date: '2013-09-14',
                    label: 'PAYMENT',
                    type: 'P',
                    amount: 535.13,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: null,
                    id: 'P-243143106',
                    details: [],
                    payDetail: {
                        confirmationNumber: '06456306103018',
                        payEventId: '243143106623',
                        paymentId: '243143106',
                        paymentType: '47',
                        paymentTypeDescription: 'CREDITCARD',
                        tenderAmount: '535.13',
                        cardType: 'C1VS',
                        cardTypeDescription: 'VISA',
                        last4DigitsOfCardNumber: '3832',
                        last4DigitsOfAccountNumber: null,
                        last4DigitsOfRoutingNumber: null,
                        bankName: null
                    }
                }
            }
        );
    });

    it('leaves state untouched for an arbitrary action', () => {
        assert.deepEqual(
            subject({
                'B-243143106': {
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: '243143106',
                    id: 'B-243143106',
                    details: [],
                    payDetail: null
                }
            },
            {type: 'Arbitrary'}),
            {
                'B-243143106': {
                    date: '2017-04-26',
                    label: 'Bill',
                    type: 'C',
                    amount: -111.5,
                    currency: '$',
                    currencyCode: 'USD',
                    billId: '243143106',
                    id: 'B-243143106',
                    details: [],
                    payDetail: null
                }
            },
            'state was untouched after an arbitrary action was fired'
        );
    });
});
