import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import {mockTranslate} from '../../../test/lib/mock-translate';

import {PaginationControlView as Subject} from './pagination-control';

const setup = ({visible, isFetching, totalPages, pageNumber}) => {
    const spyGoToNextPage = sinon.spy();
    const spyGoToPrevPage = sinon.spy();
    const wrapper = shallow(
        <Subject
            t={mockTranslate}
            visible={visible}
            isFetching={isFetching}
            totalPages={totalPages}
            pageNumber={pageNumber}
            goToNextPage={spyGoToNextPage}
            goToPreviousPage={spyGoToPrevPage}
        />
    );

    return {
        container: wrapper.find('.pagination-control'),
        previousButton: wrapper.find('.pagination-button.back'),
        nextButton: wrapper.find('.pagination-button.next'),
        info: wrapper.find('.pagination-progress'),
        spyGoToNextPage,
        spyGoToPrevPage
    };
};

describe('PaginationControlView', () => {
    it('should not render when totalPages < 2', () => {
        const {container} = setup({visible: false, isFetching: false, totalPages: 1, pageNumber: 1});

        assert.notExists(container, 'pagination control is not rendered');
    });

    it('should render', () => {
        const {container, previousButton, nextButton, info} = setup({
            visible: true,
            isFetching: false,
            totalPages: 2,
            pageNumber: 1
        });

        assert.exists(container, 'pagination control is rendered');
        assert.exists(previousButton, 'previous button is rendered');
        assert.exists(nextButton, 'next button is rendered');
        assert.strictEqual(info.text(), 'Showing page 1 of 2', 'info is rendered correctly');
    });

    it('should call appropriate actions with correct arguments when the buttons are clicked', () => {
        const {spyGoToNextPage, spyGoToPrevPage, nextButton, previousButton} = setup({
            visible: true,
            isFetching: false,
            totalPages: 2,
            pageNumber: 1
        });

        assert.isFalse(spyGoToNextPage.called, 'goToNextPage not called initially');
        assert.isFalse(spyGoToPrevPage.called, 'goToPreviousPage not called initially');

        nextButton.simulate('click', {preventDefault: () => {}});
        assert.isTrue(spyGoToNextPage.called, 'goToNextPage is triggered after clicking nextButton');
        assert.deepEqual(spyGoToNextPage.getCall(0).args[0], {totalPages: 2}, 'passes correct argument to action');

        previousButton.simulate('click', {preventDefault: () => {}});
        assert.isTrue(spyGoToPrevPage.called, 'goToPreviousPage is triggered after clicking prevButton');
        assert.deepEqual(spyGoToPrevPage.getCall(0).args[0], {totalPages: 2}, 'passes correct argument to action');
    });

    it('should disable pagination buttons if the current paginator is still fetching', () => {
        const {previousButton, nextButton} = setup({
            visible: true,
            isFetching: true,
            totalPages: 2,
            pageNumber: 1
        });

        assert.isTrue(previousButton.props().disabled, 'previous-button has disabled property');
        assert.isTrue(previousButton.hasClass('disabled'), '"disabled" styling is applied on previous-button');

        assert.isTrue(nextButton.props().disabled, 'next-button has disabled property');
        assert.isTrue(nextButton.hasClass('disabled'), '"disabled" styling is applied on next-button');
    });

    it('should disable previous-button if the current page number is equal to 1', () => {
        const {previousButton} = setup({visible: true, isFetching: false, totalPages: 2, pageNumber: 1});

        assert.isTrue(previousButton.props().disabled, 'button has disabled property');
        assert.isTrue(previousButton.hasClass('disabled'), 'class "disabled" is applied when button is disabled');
        assert.isTrue(
            previousButton.hasClass('pagination-button--disabled'),
            'class "pagination-button--disabled" applied when button is disabled'
        );
    });

    it('should disable next-button if the current page number is equal to last page', () => {
        const {nextButton} = setup({visible: true, isFetching: false, totalPages: 2, pageNumber: 2});

        assert.isTrue(nextButton.props().disabled, 'button has disabled property');
        assert.isTrue(nextButton.hasClass('disabled'), 'class "disabled" is applied when button is disabled');
        assert.isTrue(
            nextButton.hasClass('pagination-button--disabled'),
            'class "pagination-button--disabled" applied when button is disabled'
        );
    });
});
