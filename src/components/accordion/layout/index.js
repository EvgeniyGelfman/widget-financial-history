import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';

import {ApplicationError} from '../application-error';
import {Filter} from '../filter';
import {HistoryTable} from '../history-table';
import {NoDataAvailable} from '../no-data-available';
import {PaginationControl} from '../pagination-control';
import {DownloadHistory} from '../download-history';

export const LayoutComponent = ({t}) => {
    return (
        <div className="widget-financial-history-root">
            <div className="widget-financial-history-layout fh__history">
                <div className="heading-section history__heading">
                    <h1 className="display-small">{t('TITLE')}</h1>
                </div>
                <ApplicationError />
                <NoDataAvailable />

                <div className="toolbar" role="toolbar" aria-controls="history_table">
                    <Filter />
                    <DownloadHistory />
                </div>

                <HistoryTable />
                <PaginationControl />
            </div>
        </div>
    );
};

LayoutComponent.propTypes = {
    t: PropTypes.func.isRequired
};

export const Layout = translate()(LayoutComponent);
