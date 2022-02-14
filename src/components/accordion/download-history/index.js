import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {translate} from 'react-i18next';

import keys from 'lodash/fp/keys';
import anyPass from 'lodash/fp/anyPass';
import getOr from 'lodash/fp/getOr';

import {Button} from 'opattern-react/button';
/* smart icon is a bit buggy (a lot of `stroke: none !important` causes invalid colors) */
import DataTransfer from 'opattern-icons/svg/flattened/data-transfer-download-sm.svg';

import {IconicIcon} from '@opower/react-iconic';
import {Spinner} from '@opower/dss-react-components/spinner';
import {useWidgetConfig} from '@opower/maestro-react';

import {isFetchingHistoryReport} from '../../queries/query-download-history-state';
import {hasNoHistory, isAppInError} from '../../services';
import {downloadReportThunk} from '../../actions/thunks/download-history-thunk';
import {CSV_HEADERS, CSV_REPORT_FILENAME as filename} from '../../constants';

import {queryConfiguredHeaders} from '../../queries';

const DataTransferIcon = () => <IconicIcon className="icon" size="sm" src={DataTransfer} aria-hidden />;
const LoadingIcon = ({t}) => <Spinner visible messagePrefix={messagePrefix} t={t} />;
const messagePrefix = 'DOWNLOAD_HISTORY';

LoadingIcon.propTypes = {
    t: PropTypes.func.isRequired
};

const DownloadHistoryView = ({t}) => {
    const {numberOfRecordsPerPage, numberOfViewableBillYears} = useWidgetConfig(({widgetConfig}) => widgetConfig);
    const headers = useWidgetConfig(queryConfiguredHeaders);
    const enabled = useWidgetConfig(getOr(true, 'enableDownload'));
    const loading = useSelector(isFetchingHistoryReport);
    const visible = !useSelector(anyPass([isAppInError(numberOfRecordsPerPage), hasNoHistory]));

    const dispatch = useDispatch();

    const onClick = () => dispatch(downloadReportThunk({
        filename,
        numberOfViewableBillYears,
        headers: keys(headers),
        translateHeaders: header => t([`REPORT.CSV.HEADERS.${CSV_HEADERS[header].messageKey}`, header])
    }));

    // strict comparison against false, button is enabled by default, and flag must be explicitly set to `false`
    if (!visible || enabled === false) {
        return <React.Fragment />;
    }

    return (
        <div className="fh__download">
            <Button
                variant="alternate"
                icon={loading ? <LoadingIcon t={t} /> : <DataTransferIcon />}
                aria-disabled={loading}
                onClick={onClick}
                aria-label={t(`${messagePrefix}.TITLE`)}
            >
                {t(`${messagePrefix}.TITLE`)}
            </Button>
        </div>
    );
};

DownloadHistoryView.propTypes = {
    /**
     * Translate function
     */
    t: PropTypes.func.isRequired
};

export const DownloadHistory = translate()(DownloadHistoryView);
