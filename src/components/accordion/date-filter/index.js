import allPass from 'lodash/fp/allPass';
import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import negate from 'lodash/fp/negate';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import {connectConfig} from '@opower/maestro-react';

import {selectDateFilterAction as selectDateFilter} from '../../actions';
import {getState} from '../../namespace';
import {querySelectedPaginator} from '../../queries';
import {isAppInError, isHistoryEmpty} from '../../services';

import {DateFilterView} from './date-filter';

const getSelectedPaginator = compose(get('id'), querySelectedPaginator, getState);
const canShowSelector = negate(isHistoryEmpty);

export const mapStateToTarget = (globalState, {numberOfRecordsPerPage}) => {

    return {
        selectedPaginator: getSelectedPaginator(globalState) && getSelectedPaginator(globalState).split('#')[0],
        visible: allPass([negate(isAppInError(numberOfRecordsPerPage)), canShowSelector])(globalState)
    };
};

const mapConfigToProps = ({widgetConfig}) => ({
    numberOfRecordsPerPage: widgetConfig.numberOfRecordsPerPage
});

export const DateFilter = compose(
    connectConfig(mapConfigToProps),
    connect(mapStateToTarget, {selectDateFilter}),
    translate()
)(DateFilterView);
