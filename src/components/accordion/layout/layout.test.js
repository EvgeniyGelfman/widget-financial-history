import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';

import {Filter} from '../filter';
import {HistoryTable} from '../history-table';
import {PaginationControl} from '../pagination-control';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {LayoutComponent as Subject} from '.';

const setup = () => {
    const wrapper = shallow(<Subject t={mockTranslate} />);

    return {
        heading: wrapper.find('.widget-financial-history-layout .history__heading'),
        table: wrapper.find(HistoryTable),
        filter: wrapper.find(Filter),
        paginationControl: wrapper.find(PaginationControl)
    };
};

describe('Layout', () => {
    it('renders correctly', () => {
        const {heading, table, filter, paginationControl} = setup();

        assert.exists(heading, 'heading is present');
        assert.exists(table, 'history table is rendered');
        assert.exists(filter, 'filters are rendered');
        assert.exists(paginationControl, 'pagination control is rendered');
    });
});
