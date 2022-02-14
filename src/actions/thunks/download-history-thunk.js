import isEmpty from 'lodash/fp/isEmpty';

import {downloadFinancialHistory} from '../../apis';
import {fetchHistoryError, fetchHistoryStarted, fetchHistorySuccess} from '../action-creators';

import {saveAsCsv} from '../../services/save-as-csv';
import {filterUnwantedHistory} from '../../services';
import {selectedAccount} from '@opower/account-namespace/queries';

// todo: more correct implementation would be reusing existing pagination api and use some paginator for that.
export const downloadReportThunk = (
    {
        filename = 'report.csv',
        numberOfViewableBillYears = 5,
        headers,
        translateHeaders
    }) =>
    async (dispatch, globalState) => {
        dispatch(fetchHistoryStarted());

        const selectedAccountId = selectedAccount.getId(globalState());

        try {
            const {history} =
                await downloadFinancialHistory({selectedAccountId, period: `P${numberOfViewableBillYears}y`});

            const res = dispatch(fetchHistorySuccess(history));

            if (!isEmpty(history)) {
                const fileSaver = saveAsCsv({filename, headers, translateHeaders});

                await fileSaver(filterUnwantedHistory(
                    history
                ));
            }

            return res;
        } catch (error) {
            return dispatch(fetchHistoryError(error));
        }
    };
