import compose from 'lodash/fp/compose';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import {connectConfig} from '@opower/maestro-react';

import {isAppInError} from '../../services';

import {ApplicationErrorView} from './application-error';

export const mapStateToTarget = (globalState, {numberOfRecordsPerPage}) => ({
    visible: isAppInError(numberOfRecordsPerPage)(globalState)
});

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfRecordsPerPage: widgetConfig.numberOfRecordsPerPage
});

export const ApplicationError = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget),
    translate()
)(ApplicationErrorView);
