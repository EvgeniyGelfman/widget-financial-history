import {compose} from 'redux';
import filter from 'lodash/fp/filter';
import negate from 'lodash/fp/negate';
import isEmpty from 'lodash/fp/isEmpty';
import map from 'lodash/fp/map';
import pick from 'lodash/fp/pick';
import {CSV_HEADERS} from '../constants';

const filterConfiguredCsvHeaders = (allHeaders, configuredHeaders) => {
    const fields = compose(filter(negate(isEmpty)), map(header => header.trim()))(configuredHeaders.split(','));

    if (isEmpty(fields)) {
        return allHeaders;
    }

    return pick(fields)(allHeaders);
};

export const queryConfiguredHeaders = ({widgetConfig}) => {
    return filterConfiguredCsvHeaders(CSV_HEADERS, widgetConfig.csvFields);
};
