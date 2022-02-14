import {assert} from 'chai';
import moment from 'moment-timezone';

import {json2csv as subject} from './json2csv';

const data = [
    {
        date: '2018-10-24',
        label: 'Payment',
        type: 'P',
        amount: 33.3,
        currency: '$',
        currencyCode: 'USD',
        billId: '',
        billDetails: [
            {label: 'Elec'},
            {label: 'Gas'}
        ],
        payDetail: {
            confirmationNumber: '17756232103444',
            payEventId: '123143106623',
            paymentId: '223100106',
            tenderDetails: [{
                tenderType: 'APSV',
                tenderTypeDescription: 'Checking - Auto Pay - CSS',
                paymentType: '37',
                paymentTypeDescription: 'Saving',
                tenderAmount: 33.3,
                cardType: null,
                cardTypeDescription: null,
                last4DigitsOfCardNumber: null,
                last4DigitsOfAccountNumber: '2142',
                last4DigitsOfRoutingNumber: null,
                bankName: 'Bank of America'
            }]
        }
    }
];
const defaultHeaders = [
    'date', 'label', 'amount', 'currency', 'currencyCode',
    'billId', 'paymentId', 'last4DigitsOfAccountNumber', 'bankName'
];

describe('json2csv', () => {
    it('sanity check', async () => {
        const converter = subject({
            headers: [
                'date',
                'label',
                'amount',
                'currency',
                'currencyCode',
                'last4DigitsOfAccountNumber',
                'bankName'
            ]
        });

        assert.deepEqual(
            await converter([].concat(data, data)),
            'date,label,amount,currency,currencyCode,last4DigitsOfAccountNumber,bankName\r\n' +
            '2018-10-24,Payment,33.3,$,USD,2142,Bank of America\r\n' +
            '2018-10-24,Payment,33.3,$,USD,2142,Bank of America',
            'json2csv should generate valid CSV'
        );
    });

    it('default options', async () => {
        const converter = subject({headers: defaultHeaders});

        assert.deepEqual(
            await converter([].concat(data, data)),
            'date,label,amount,currency,currencyCode,billId,paymentId,last4DigitsOfAccountNumber,bankName\r\n' +
            '2018-10-24,Payment,33.3,$,USD,,223100106,2142,Bank of America\r\n' +
            '2018-10-24,Payment,33.3,$,USD,,223100106,2142,Bank of America',
            'default behaviour for json-2-csv has been changed, please check changelog/defaults'
        );
    });

    it('can join deep arrays', async () => {
        const converter = subject({
            headers: ['last4DigitsOfAccountNumber', 'bankName']
        });

        assert.deepEqual(
            await converter([{
                payDetail:
                    {
                        tenderDetails: [
                            {last4DigitsOfAccountNumber: '1234', bankName: 'Bank1'},
                            {last4DigitsOfAccountNumber: '4321', bankName: 'Bank2'}
                        ]
                    }
            }]),
            'last4DigitsOfAccountNumber,bankName,last4DigitsOfAccountNumber,bankName\r\n' +
            '1234,Bank1,4321,Bank2',
            'Unable to convert deep arrayObjects to CSV.'
        );
    });

    it('Still ignores empty values', async () => {
        const converter = subject({
            headers: ['last4DigitsOfAccountNumber', 'bankName']
        });

        assert.deepEqual(
            await converter([{
                payDetail:
                    {
                        tenderDetails: [
                            {last4DigitsOfAccountNumber: '1234', bankName: 'Bank1'},
                            {bankName: 'Bank2'}
                        ]
                    }
            }]),
            'last4DigitsOfAccountNumber,bankName,last4DigitsOfAccountNumber,bankName\r\n' +
            '1234,Bank1,,Bank2',
            'empty fields should stay empty.'
        );
    });

    it('Allow to specify custom converters', async () => {
        const converter = subject({
            headers: ['date', 'amount'],
            converter: (value, record, path) => {
                if (!path.match(/^date/)) {
                    return value;
                }
                return moment(value).format('YYYY MM');
            }
        });

        assert.deepEqual(
            await converter(data),
            // eslint-disable-next-line no-useless-escape
            'date,amount\r\n2018 10,33.3',
            'date should be converted to different format'
        );
    });
});
