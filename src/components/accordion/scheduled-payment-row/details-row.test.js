import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';

import {DetailsRow} from './details-row';

const setup = (label, value, className) => {
    const wrapper =  shallow(
        <DetailsRow
            label={label}
            value={value}
            className={className}
        />
    );

    return {
        key: wrapper.find('.details-row__key'),
        value: wrapper.find('.details-row__value'),
        row: wrapper.find('tr'),
        element: wrapper
    };
};

describe('ScheduledPayment#DetailsRow', () => {
    it('renders 2 columns with passed label and value ', () => {
        const {key, value, element} = setup('label', 'value', 'specific-classname');

        assert.strictEqual(
            key.text(),
            'label',
            'Should render a label in first column'
        );

        assert.strictEqual(
            value.text(),
            'value',
            'Should render a value'
        );

        assert.isTrue(
            element.find('.details-row').hasClass('specific-classname'),
            'className prop is passed down to .details-row container'
        );
    });

    it( 'do not render second column if no value passed.', () => {
        const {key, value} = setup('label');

        assert.strictEqual(
            key.text(),
            'label',
            'Should render a label in first column'
        );

        assert.strictEqual(
            key.prop('colSpan'),
            2,
            'Expecting colspan to be 2 when `value` prop is not passed'
        );

        assert.notExists(
            value,
            'should not render value column'
        );
    });
});
