import allPass from 'lodash/fp/allPass';
import compose from 'lodash/fp/compose';
import negate from 'lodash/fp/negate';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import {connectConfig} from '@opower/maestro-react';

import {isAppInError, isHistoryEmpty} from '../../services';

import {NoDataAvailableView} from './no-data-available';

export const mapStateToTarget = (globalState, {numberOfRecordsPerPage}) => {
    return {
        visible: allPass([negate(isAppInError(numberOfRecordsPerPage)), isHistoryEmpty])(globalState)
    };
};

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfRecordsPerPage: widgetConfig.numberOfRecordsPerPage
});

export const NoDataAvailable = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget),
    translate()
)(NoDataAvailableView);
