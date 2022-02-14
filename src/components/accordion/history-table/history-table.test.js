import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';

import {Spinner} from '@opower/dss-react-components/spinner';

import {BillRow} from '../bill-row';
import {PaymentRow} from '../payment-row';
import {ScheduledPaymentRow} from '../scheduled-payment-row';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {HistoryTableView} from './history-table';

const setup = ({
    history,
    scheduledPayments,
    shouldShowPagination,
    isFetching = false,
    shouldShowNoFilteredData = false,
    visible = true
} = {}) => shallow(
    <HistoryTableView
        t={mockTranslate}
        numberOfDecimalPlaces={2}
        history={history}
        scheduledPayments={scheduledPayments}
        shouldShowPagination={shouldShowPagination}
        isFetching={isFetching}
        shouldShowNoFilteredData={shouldShowNoFilteredData}
        visible={visible}
    />
);

describe('HistoryTableView', () => {
    it('should render', () => {
        const history = [{
            date: '2018-10-24',
            label: 'Payment',
            type: 'P',
            amount: 33.3,
            currency: '$',
            currencyCode: 'USD',
            billId: '',
            id: 'P-223100106',
            billDetails: [],
            payDetail: {
                confirmationNumber: '17756232103444',
                payEventId: '123143106623',
                paymentId: '223100106',
                paymentType: '47',
                paymentTypeDescription: 'CREDITCARD',
                amount: 33.3,
                cardType: 'C1VS',
                cardTypeDescription: 'VISA',
                last4DigitsOfCardNumber: '3832',
                last4DigitsOfAccountNumber: null,
                last4DigitsOfRoutingNumber: null,
                bankName: null
            }
        }, {
            date: '2018-10-15',
            label: 'Bill',
            type: 'C',
            amount: -8.7,
            currency: '$',
            currencyCode: 'USD',
            billId: '12274411215',
            billDetails: [],
            id: '1'
        }, {
            date: '2018-10-15',
            label: 'Bill',
            type: 'C',
            amount: -8.7,
            currency: '$',
            currencyCode: 'USD',
            billId: '1227441215',
            billDetails: [],
            id: '2'
        }];

        const historyTableWrapper = setup({history, scheduledPayments: [], shouldShowPagination: false});

        assert.exists(
            historyTableWrapper.find('.history__table'),
            'table is rendered'
        );

        assert.strictEqual(
            historyTableWrapper.find(BillRow).length,
            2,
            'correct number of bill rows are rendered'
        );

        assert.equal(
            historyTableWrapper.find(BillRow).at(0).props().rowIndex,
            2,
            'Bill row has correct row index'
        );

        assert.strictEqual(
            historyTableWrapper.find(PaymentRow).length,
            1,
            'correct number of payment rows are rendered'
        );

        assert.equal(
            historyTableWrapper.find(PaymentRow).at(0).props().rowIndex,
            1,
            'Payment row has correct row index'
        );
    });

    it('should render the payments and bills', () => {
        const history = [{
            date: '2018-10-24',
            label: 'Payment',
            type: 'P',
            amount: 33.3,
            currency: '$',
            currencyCode: 'USD',
            billId: null,
            billDetails: [],
            payDetail: null,
            id: '0'
        }, {
            date: '2018-10-24',
            label: 'Payment',
            type: 'P',
            amount: 33.3,
            currency: '$',
            currencyCode: 'USD',
            billId: '',
            billDetails: [],
            payDetail: null,
            id: '1'
        }, {
            date: '2018-10-15',
            label: 'Bill',
            type: 'C',
            amount: -8.7,
            currency: '$',
            currencyCode: 'USD',
            billId: '12274411215',
            billDetails: [],
            id: '2'
        }];

        const historyTableWrapper = setup({history, scheduledPayments: [], shouldShowPagination: false});

        assert.exists(
            historyTableWrapper.find('.history__table'),
            'table is rendered'
        );

        assert.strictEqual(
            historyTableWrapper.find(BillRow).length,
            1,
            'correct number of bill rows are rendered'
        );

        assert.strictEqual(
            historyTableWrapper.find(PaymentRow).length,
            2,
            'correct number of payment rows are rendered when bill id is null or empty'
        );
    });

    it('renders no-data-available when no history exists', () => {
        const historyTableWrapper = setup({
            history: [],
            scheduledPayments: [],
            shouldShowPagination: false,
            shouldShowNoFilteredData: true
        });

        assert.strictEqual(
            historyTableWrapper.find('.no-data-container').length,
            1,
            'no data available component is rendered'
        );

        assert.isEmpty(
            historyTableWrapper.find(BillRow),
            'no bills are rendered'
        );

        assert.isEmpty(
            historyTableWrapper.find(PaymentRow),
            'no payments are rendered'
        );

        assert.isEmpty(
            historyTableWrapper.find(ScheduledPaymentRow),
            'no scheduled payments rendered'
        );
    });

    it('should render when both scheduled payments and history exists', () => {
        const history = [{
            date: '2018-10-24',
            label: 'Payment',
            type: 'P',
            amount: 33.3,
            currency: '$',
            currencyCode: 'USD',
            billId: null,
            billDetails: [],
            payDetail: {
                confirmationNumber: '17756232103444',
                payEventId: '123143106623',
                paymentId: '223100106',
                paymentType: '47',
                paymentTypeDescription: 'CREDITCARD',
                amount: 33.3,
                cardType: 'C1VS',
                cardTypeDescription: 'VISA',
                last4DigitsOfCardNumber: '3832',
                last4DigitsOfAccountNumber: null,
                last4DigitsOfRoutingNumber: null,
                bankName: null
            },
            id: 'P-223100106'
        }, {
            date: '2018-10-15',
            label: 'Bill',
            type: 'C',
            amount: -8.7,
            currency: '$',
            currencyCode: 'USD',
            billId: '12274411215',
            billDetails: [{
                label: 'Gas Service',
                amount: 41.3,
                currency: '$'
            }, {
                label: 'Adjustment',
                amount: -50.0,
                currency: '$'
            }],
            id: 'C-12274411215'
        }];

        const scheduledPayments = [{
            id: '0',
            paymentId: '0',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'PENDING',
            description: 'Payment Method XXXX'
        }];

        const historyTableWrapper = setup({history, scheduledPayments, shouldShowPagination: false});

        assert.exists(
            historyTableWrapper.find('.history__table'),
            'table is rendered'
        );

        assert.strictEqual(
            historyTableWrapper.find(BillRow).length,
            1,
            'correct number of bill rows are rendered'
        );

        assert.strictEqual(
            historyTableWrapper.find(PaymentRow).length,
            1,
            'correct number of payment rows are rendered'
        );

        assert.strictEqual(
            historyTableWrapper.find(ScheduledPaymentRow).length,
            1,
            'correct number of scheduled payment rows are rendered'
        );

        assert.equal(
            historyTableWrapper.find(ScheduledPaymentRow).props().rowIndex,
            1,
            'Scheduled payment row has correct row index'
        );
    });

    it('should render history table when scheduled payments exists', () => {
        const scheduledPayments = [{
            id: '0',
            paymentId: '0',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'PENDING',
            description: 'Payment Method XXXX'
        }];

        const historyTableWrapper = setup({history: [], scheduledPayments, shouldShowPagination: false});

        assert.exists(
            historyTableWrapper.find('.history__table'),
            'table is rendered'
        );

        assert.strictEqual(
            historyTableWrapper.find(ScheduledPaymentRow).length,
            1,
            'correct number of scheduled payment rows are rendered'
        );
    });

    it('should collapse margin if pagination-control is displayed', () => {
        const history = [{
            date: '2018-10-24',
            label: 'Payment',
            type: 'P',
            amount: 33.3,
            currency: '$',
            currencyCode: 'USD',
            billId: '',
            billDetails: [],
            payDetail: null,
            id: '0'
        }];

        const withoutPaginationWrapper = setup({history, scheduledPayments: [], shouldShowPagination: false});

        assert.isFalse(
            withoutPaginationWrapper.find('.history__table').hasClass('history__table--collapsed-margin'),
            'does not collapse margin-bottom when there is no pagination-control'
        );

        const withMarginCollapsedWrapper = setup({history, scheduledPayments: [], shouldShowPagination: true});

        assert.isTrue(
            withMarginCollapsedWrapper.find('.history__table').hasClass('history__table--collapsed-margin'),
            'apply a specific class to collapse the margin-bottom when pagination-control is shown'
        );
    });

    it('shows or hides spinner based on whether or not data is being fetched', () => {
        const withSpinner = setup({history: [], scheduledPayments: [], shouldShowPagination: false, isFetching: true});

        assert.isTrue(
            withSpinner.find(Spinner).props().visible,
            'displays spinner when data is being fetched'
        );

        const history = [{
            date: '2018-10-24',
            label: 'Payment',
            type: 'P',
            amount: 33.3,
            currency: '$',
            currencyCode: 'USD',
            billId: '',
            billDetails: [],
            payDetail: null,
            id: '0'
        }];

        const withoutSpinner = setup({
            history,
            scheduledPayments: [],
            shouldShowPagination: false,
            isFetching: false
        });

        assert.notExists(
            withoutSpinner.find(Spinner),
            'spinner is not shown when data is available'
        );
    });
});
