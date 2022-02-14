import React from 'react';
import PropTypes from 'prop-types';

import {ExperienceLink} from '@opower/maestro-react/experiences';

import ChevronLeftSvg from '!!svg-react-loader!opattern-icons/svg/flattened/warning-lg.svg';

export const ApplicationErrorView = ({t, visible}) => {
    if (!visible) {
        return <React.Fragment />;
    }

    return (
        <div className="loading-error loading-error--full-row loading-error--nested-block">
            <ChevronLeftSvg className="loading-error__icon" focusable={false} />
            <div className="loading-error__heading">
                {t('ERROR.HEADING')}
            </div>
            <p>
                <span className="loading-error__subheading">{t('ERROR.SUB_HEADING')}</span>
                &nbsp;
                <ExperienceLink targetConfigKey="billHistory" className="try-again-link">
                    {t('ERROR.TRY_AGAIN')}
                </ExperienceLink>
            </p>
        </div>
    );
};

ApplicationErrorView.propTypes = {
    t: PropTypes.func.isRequired,
    visible: PropTypes.bool
};

ApplicationErrorView.defaultProps = {
    visible: false
};
