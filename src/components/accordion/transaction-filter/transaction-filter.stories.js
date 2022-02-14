import React from 'react';

import {storiesOf} from '@storybook/react';

import {selectTransactionFilterAction} from '../../actions';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {TransactionFilterView} from './transaction-filter';

const filterValues = [
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

const makeStory = (currentFilter) => {
    return () => (
        <TransactionFilterView
            t={mockTranslate}
            selectTransactionFilter={selectTransactionFilterAction}
            currentFilter={currentFilter}
            visible
            filterValues={filterValues}
        />
    );
};

storiesOf('TransactionFilterView', module)
    .add('Default', makeStory())
    .add('currentFilter', makeStory('C1PS'));
