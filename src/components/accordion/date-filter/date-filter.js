import React from 'react';
import map from 'lodash/fp/map';
import PropTypes from 'prop-types';

import {DATE_FILTER_OPTIONS} from '../../constants';

import CaretBottomSvg from '!!svg-react-loader!opattern-icons/svg/flattened/caret-bottom-sm.svg';

export const DateFilterView = ({t, selectDateFilter, selectedPaginator, visible}) => {
    if (!visible) {
        return <React.Fragment />;
    }

    return (
        <div className="custom-select date-filter-container">
            <select
                onChange={(e) => selectDateFilter({selectedOption: e.target.value})}
                value={selectedPaginator}
                aria-label={t(`DATE_FILTER.A11Y.LABEL.SELECT_RANGE`)}
                aria-controls="history_table"
            >
                {map(
                    (detail) => {
                        return (
                            <option value={detail} key={detail}>
                                {t(`DATE_FILTER.LABEL.${detail}`)}
                            </option>
                        );
                    },
                    DATE_FILTER_OPTIONS
                )}
            </select>
            <div className="custom-select-bg">
                <CaretBottomSvg className="icon" />
            </div>
        </div>
    );
};

DateFilterView.propTypes = {
    t: PropTypes.func.isRequired,
    selectDateFilter: PropTypes.func.isRequired,
    selectedPaginator: PropTypes.string,
    visible: PropTypes.bool
};

DateFilterView.defaultProps = {
    selectedPaginator: '',
    visible: false
};
