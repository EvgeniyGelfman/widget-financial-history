import React from 'react';

import {storiesOf} from '@storybook/react';

import {selectDateFilterAction} from '../../actions';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {DateFilterView} from './date-filter';

const makeStory = (selectedPaginator) => {
    return () => (
        <DateFilterView
            t={mockTranslate}
            selectDateFilter={selectDateFilterAction}
            selectedPaginator={selectedPaginator}
            visible
        />
    );
};

storiesOf('DateFilterView', module)
    .add('Default', makeStory())
    .add('SelectedPaginator', makeStory('THIS_YEAR_DATES'));
