import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import isNil from 'lodash/fp/isNil';
import negate from 'lodash/fp/negate';

const notNil = negate(isNil);

export const DetailsRow = ({label, value, className}) => {
    const hasValue = notNil(value);

    return (
        <tr className={classnames('details-row', className)}>
            <td className="details-row__key" colSpan={hasValue ? 1 : 2}>
                {label}
            </td>
            {hasValue && (
                <td className="details-row__value">
                    {value}
                </td>
            )}
        </tr>
    );
};

DetailsRow.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    className: PropTypes.string
};

DetailsRow.defaultProps = {
    value: null,
    className: ''
};
