import React from 'react';
import map from 'lodash/fp/map';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/fp/isEmpty';

import CaretBottomSvg from '!!svg-react-loader!opattern-icons/svg/flattened/caret-bottom-sm.svg';

export const TransactionFilterView = ({t, selectTransactionFilter, currentFilter, visible, filterValues}) => {
    if (!visible) {
        return <React.Fragment />;
    }

    return (
        <div className="custom-select transaction-filter-container">
            {
                !isEmpty(filterValues) && (
                    <select
                        onChange={(e) => selectTransactionFilter({selectedOption: e.target.value})}
                        value={currentFilter}
                        aria-label={t(`TRANSACTION_FILTER.A11Y.LABEL.SELECT_RANGE`)}
                        aria-controls="history_table"
                    >
                        {map(
                            (detail) => {
                                return (
                                    <option value={detail.filterType} key={detail.filterType}>
                                        {t([`TRANSACTION_FILTER.LABEL.${detail.filterTypeDescription}`,
                                            detail.filterTypeDescription])}
                                    </option>
                                );
                            }, filterValues
                        )}
                    </select>
                )
            }
            <div className="custom-select-bg">
                <CaretBottomSvg className="icon" />
            </div>
        </div>
    );
};

TransactionFilterView.propTypes = {
    t: PropTypes.func.isRequired,
    selectTransactionFilter: PropTypes.func.isRequired,
    currentFilter: PropTypes.string,
    visible: PropTypes.bool,
    filterValues: PropTypes.shape({
        filterType: PropTypes.string,
        filterTypeDescription: PropTypes.string
    }).isRequired
};

TransactionFilterView.defaultProps = {
    currentFilter: '',
    visible: false
};
