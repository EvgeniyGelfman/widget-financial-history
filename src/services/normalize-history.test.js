import {assert} from 'chai';

import {normalizeHistory as subject} from './normalize-history';

describe('normalizeHistory', () => {

    it('normalizes the records correctly', () => {
        const result = subject([
            {
                date: '2013-10-03',
                label: 'Bill',
                type: 'C',
                amount: '772.25',
                currency: '$',
                billId: '261869468973',
                details: [{
                    label: 'Cable',
                    amount: '36.8',
                    currency: '$'
                }]
            },
            {
                date: '2013-09-14',
                label: 'PAYMENT',
                type: 'P',
                amount: '535.13',
                currency: '$',
                billId: '',
                payDetail: {
                    confirmationNumber: '06456306103018',
                    payEventId: '243143106623',
                    paymentId: '243143106',
                    paymentType: '47',
                    paymentTypeDescription: 'CREDITCARD',
                    tenderAmount: '535.13',
                    cardType: 'C1VS',
                    cardTypeDescription: 'VISA',
                    last4DigitsOfCardNumber: '1235',
                    last4DigitsOfAccountNumber: null,
                    last4DigitsOfRoutingNumber: null,
                    bankName: null
                }
            }
        ]);

        assert.deepEqual(
            result,
            {
                entities: {
                    history: {
                        'B-261869468973': {
                            id: 'B-261869468973',
                            date: '2013-10-03',
                            label: 'Bill',
                            type: 'C',
                            amount: '772.25',
                            currency: '$',
                            billId: '261869468973',
                            details: [{
                                label: 'Cable',
                                amount: '36.8',
                                currency: '$'
                            }]
                        },
                        'P-243143106': {
                            id: 'P-243143106',
                            date: '2013-09-14',
                            label: 'PAYMENT',
                            type: 'P',
                            amount: '535.13',
                            currency: '$',
                            billId: '',
                            payDetail: {
                                confirmationNumber: '06456306103018',
                                payEventId: '243143106623',
                                paymentId: '243143106',
                                paymentType: '47',
                                paymentTypeDescription: 'CREDITCARD',
                                tenderAmount: '535.13',
                                cardType: 'C1VS',
                                cardTypeDescription: 'VISA',
                                last4DigitsOfCardNumber: '1235',
                                last4DigitsOfAccountNumber: null,
                                last4DigitsOfRoutingNumber: null,
                                bankName: null
                            }
                        }
                    }
                },
                result: ['B-261869468973', 'P-243143106']
            },
            'normalizes the records correctly'
        );
    });

    it('does not break for empty history', () => {
        assert.deepEqual(subject([]), {entities: {}, result: []}, 'returns correct normalized schema for empty array');
    });
});
