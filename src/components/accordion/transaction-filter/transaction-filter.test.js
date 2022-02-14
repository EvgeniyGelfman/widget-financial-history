import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';
import noop from 'lodash/fp/noop';
import sinon from 'sinon';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {TransactionFilterView} from './transaction-filter';

const filterCriteriaRecords = [
    {
        filterType: 'C1AD',
        filterTypeDescription: 'ADJUSTMENTS'
    },
    {
        filterType: 'C1AL',
        filterTypeDescription: 'ALL_TRANSACTIONS'
    },
    {
        filterType: 'C1BL',
        filterTypeDescription: 'BILLS'
    },
    {
        filterType: 'C1PS',
        filterTypeDescription: 'PAYMENTS'
    }
];

describe('TransactionFilterView', () => {
    it('should render', () => {
        const transactionFilter = mount(
            <TransactionFilterView
                t={mockTranslate}
                selectTransactionFilter={noop}
                currentFilter="ALL_TRANSACTIONS"
                visible
                filterValues={filterCriteriaRecords}
            />
        );

        assert.exists(
            transactionFilter.find('.custom-select'),
            'transactionFilter is rendered'
        );

        assert.strictEqual(
            transactionFilter.find('.transaction-filter-container select option').length,
            4,
            'correct number of options are rendered'
        );

        const options = transactionFilter.find('.transaction-filter-container select option').map((option) =>
            option.text()
        );

        assert.deepEqual(
            options,
            ['Adjustments', 'All transactions', 'Bills', 'Payments'],
            'correct options are rendered'
        );

        const selectedOption = transactionFilter.find('.transaction-filter-container select').props().value;

        assert.strictEqual(
            selectedOption,
            'ALL_TRANSACTIONS',
            'correct option is selected'
        );
    });

    it('should call callback function when value changes', () => {
        const setTransactionFilterSpy = sinon.spy();
        const transactionFilter = mount(
            <TransactionFilterView
                t={mockTranslate}
                selectTransactionFilter={setTransactionFilterSpy}
                currentFilter="ALL_TRANSACTIONS"
                visible
                filterValues={filterCriteriaRecords}
            />
        );

        assert.isFalse(
            setTransactionFilterSpy.called,
            'callback not called initially'
        );

        const transactionFilterSelector = transactionFilter.find('.custom-select select');

        transactionFilterSelector.simulate('change', {target: {value: 'THIS_YEAR_DATES'}});

        assert.isTrue(
            setTransactionFilterSpy.called,
            'callback was called'
        );

        assert.deepEqual(
            setTransactionFilterSpy.getCall(0).args[0],
            {selectedOption: 'THIS_YEAR_DATES'},
            'passes correct arguments to the callback function'
        );
    });

    it('should not render when visible prop is set to false', () => {
        const transactionFilter = mount(
            <TransactionFilterView
                t={mockTranslate}
                selectTransactionFilter={noop}
                currentFilter="ALL_TRANSACTIONS"
                visible={false}
            />
        );

        assert.notExists(
            transactionFilter.find('.custom-select'),
            'transactionFilter is not rendered'
        );
    });
});
