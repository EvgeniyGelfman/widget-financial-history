import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';
import noop from 'lodash/fp/noop';
import sinon from 'sinon';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {DateFilterView} from './date-filter';

describe('DateFilterView', () => {
    it('should render', () => {
        const dateFilter = mount(
            <DateFilterView t={mockTranslate} selectDateFilter={noop} selectedPaginator="ALL_DATES" visible />
        );

        assert.exists(
            dateFilter.find('.custom-select'),
            'dateFilter is rendered'
        );

        assert.strictEqual(
            dateFilter.find('.date-filter-container select option').length,
            3,
            'correct number of options are rendered'
        );

        const options = dateFilter.find('.date-filter-container select option').map((option) => option.text());

        assert.deepEqual(
            options,
            ['All dates', 'This year dates', 'Last year dates'],
            'correct options are rendered'
        );

        const selectedOption = dateFilter.find('.date-filter-container select').props().value;

        assert.strictEqual(
            selectedOption,
            'ALL_DATES',
            'correct option is selected'
        );
    });

    it('should call callback function when value changes', () => {
        const setDateFilterSpy = sinon.spy();
        const dateFilter = mount(
            <DateFilterView
                t={mockTranslate}
                selectDateFilter={setDateFilterSpy}
                selectedPaginator="ALL_DATES"
                visible
            />
        );

        assert.isFalse(
            setDateFilterSpy.called,
            'callback not called initially'
        );

        const dateFilterSelector = dateFilter.find('.custom-select select');

        dateFilterSelector.simulate('change', {target: {value: 'THIS_YEAR_DATES'}});

        assert.isTrue(
            setDateFilterSpy.called,
            'callback was called'
        );

        assert.deepEqual(
            setDateFilterSpy.getCall(0).args[0],
            {selectedOption: 'THIS_YEAR_DATES'},
            'passes correct arguments to the callback function'
        );
    });

    it('should not render when visible prop is set to false', () => {
        const dateFilter = mount(
            <DateFilterView t={mockTranslate} selectDateFilter={noop} selectedPaginator="ALL_DATES" visible={false} />
        );

        assert.notExists(
            dateFilter.find('.custom-select'),
            'dateFilter is not rendered'
        );
    });
});
