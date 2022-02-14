import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';
import noop from 'lodash/fp/noop';

import {Accordion} from '../accordion';
import {namespace} from '../../namespace';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {BillRowView, mapStateToTarget as subject} from '.';

const setup = (bill) => {
    return shallow(
        <BillRowView t={mockTranslate} bill={bill} numberOfDecimalPlaces={2} toggleAccordion={noop} isOpen />
    );
};

describe('BillRow - mapStateToTarget', () => {
    it('should return correct response from mapStateToTarget', () => {
        const result = subject({[namespace]: {accordion: {}}}, {bill: {id: 'B-12274411215'}});

        assert.deepEqual(result, {isOpen: false}, 'returns correct response for mapStateToTarget');
    });

    it('should return correct response from mapStateToTarget when accordion has entry for given id', () => {
        const result = subject({[namespace]: {accordion: {'B-12274411215': true}}}, {bill: {id: 'B-12274411215'}});

        assert.deepEqual(result, {isOpen: true}, 'returns correct response for mapStateToTarget');
    });
});

describe('BillRowView', () => {
    it('should render bill row', () => {
        const bill = {
            id: '1',
            date: '2018-10-05',
            label: 'Bill',
            type: 'C',
            amount: 100,
            currency: '$',
            currencyCode: 'USD',
            billId: 1
        };

        const billRowWrapper = setup(bill);

        assert.exists(
            billRowWrapper.find('.activity-description').text(),
            'Bill',
            'renders correct activity description for bill'
        );

        assert.strictEqual(
            billRowWrapper.find('.activity-date').text(),
            'Oct 5, 2018',
            'renders correct date format (MMM D, YYYY) for a record'
        );

        assert.strictEqual(
            billRowWrapper.find('.activity-amount').text(),
            '$100.00',
            'renders amount correctly with correct currency and two decimal points'
        );

        assert.strictEqual(
            billRowWrapper.find(Accordion).prop('label'),
            'Bill Posted',
            'renders Accordion'
        );
    });
});
