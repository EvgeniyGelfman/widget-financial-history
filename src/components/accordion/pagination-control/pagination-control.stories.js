import React from 'react';

import {storiesOf} from '@storybook/react';

import {goToPreviousPageAction as goToPreviousPage, goToNextPageAction as goToNextPage} from '../../actions';
import {mockTranslate} from '../../../test/lib/mock-translate';

import {PaginationControlView} from './pagination-control';

const makeStory = ({visible, isFetching, totalPages, pageNumber}) => {
    return () => (
        <PaginationControlView
            t={mockTranslate}
            visible={visible}
            isFetching={isFetching}
            totalPages={totalPages}
            pageNumber={pageNumber}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
        />
    );
};

storiesOf('PaginationControlView', module)
    .add('Default', makeStory({visible: true, isFetching: false, totalPages: 2, pageNumber: 1}));
