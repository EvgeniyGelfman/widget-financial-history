import React from 'react';
import PropTypes from 'prop-types';

import {ExperienceLink} from '@opower/maestro-react/experiences';

export const NoDataAvailableView = ({t, visible}) => {
    if (!visible) {
        return <React.Fragment />;
    }

    return (
        <div className="no-data-container">
            <h1 className="display-smaller">
                {t('NO_DATA.HEADING')}
            </h1>
            <p className="quiet">
                {t('NO_DATA.SUB_HEADING')}
            </p>
            <ExperienceLink targetConfigKey="accountOverview" className="overview-link button primary">
                {t('NO_DATA.RETURN_TO_OVERVIEW')}
            </ExperienceLink>
        </div>
    );
};

NoDataAvailableView.propTypes = {
    t: PropTypes.func.isRequired,
    visible: PropTypes.bool
};

NoDataAvailableView.defaultProps = {
    visible: false
};
