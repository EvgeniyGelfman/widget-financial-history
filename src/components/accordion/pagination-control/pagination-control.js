import React from 'react';
import classnames from 'classnames';
import eq from 'lodash/fp/eq';
import PropTypes from 'prop-types';

import ChevronLeftSvg from '!!svg-react-loader!opattern-icons/svg/flattened/chevron-left-sm.svg';
import ChevronRightSvg from '!!svg-react-loader!opattern-icons/svg/flattened/chevron-right-sm.svg';

export const PaginationControlView = ({
    visible,
    isFetching,
    totalPages,
    pageNumber,
    t,
    goToNextPage,
    goToPreviousPage
}) => {
    if (!visible) {
        return <React.Fragment />;
    }

    const isPrevDisabled = eq(1, pageNumber) || isFetching;
    const prevClasses = classnames(
        'button',
        'back',
        'control',
        'pagination-button',
        {disabled: isPrevDisabled},
        {'pagination-button--disabled': isPrevDisabled}
    );
    const prevClickHandler = (event) => {
        event.preventDefault();
        goToPreviousPage({totalPages});
    };

    const isNextDisabled = eq(totalPages, pageNumber) || isFetching;
    const nextClasses = classnames(
        'button',
        'next',
        'control',
        'pagination-button',
        {disabled: isNextDisabled},
        {'pagination-button--disabled': isNextDisabled}
    );
    const nextClickHandler = (event) => {
        event.preventDefault();
        goToNextPage({totalPages});
    };

    return (
        <div className="pagination-control">
            <div className="pagination-control__controls arrow-navigation">
                <button
                    type="button"
                    aria-disabled={isPrevDisabled}
                    disabled={isPrevDisabled}
                    className={prevClasses}
                    onClick={prevClickHandler}
                    aria-label={t(`PAGINATION_CONTROL.A11Y.LABEL.PREVIOUS_PAGE`)}
                >
                    <ChevronLeftSvg className="pagination-button__icon icon" focusable={false} />
                </button>
                <span className="pagination-progress page-number">
                    {t(`PAGINATION_CONTROL.PROGRESS`, {pageNumber, totalPages})}
                </span>
                <button
                    type="button"
                    aria-disabled={isNextDisabled}
                    disabled={isNextDisabled}
                    className={nextClasses}
                    onClick={nextClickHandler}
                    aria-label={t(`PAGINATION_CONTROL.A11Y.LABEL.NEXT_PAGE`)}
                >
                    <ChevronRightSvg className="pagination-button__icon icon" focusable={false} />
                </button>
            </div>
        </div>
    );
};

PaginationControlView.propTypes = {
    visible: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    totalPages: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    t: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPreviousPage: PropTypes.func.isRequired
};
