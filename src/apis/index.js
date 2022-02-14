import getOr from 'lodash/fp/getOr';
import isNil from 'lodash/fp/isNil';
import negate from 'lodash/fp/negate';
import pickBy from 'lodash/fp/pickBy';

import {fetch} from '@opower/fetch';
import {resolveEdgeUrlWithHeaders} from '@opower/maestro-runtime/http';

import {validateFinancialHistoryResponse, validateFinancialHistoryDownloadResponse} from './schema/validate-schema';

const pickNonNull = pickBy(negate(isNil));

/**
 * @typedef FinancialHistoryResponse
 * @type {object}
 * @property {string} recentDate - Optional. most recent date in history chunk. A date string in YYYY-MM-DD format.
 * @property {string} pastDate - Optional. most past date in history chunk. A date string in YYYY-MM-DD format.
 * @property {number} offset - number of records skipped before this chunk.
 * @property {number} limit - requested records limit.
 * @property {string} dateOfOldestRecord - most oldest date in entire history. A date string in YYYY-MM-DD format.
 * @property {number} totalRecords - Total count of records in entire history.
 * @property {Array<PayEvent>} history - financial history
 */

/**
 * @typedef PayEvent
 * @type {object}
 * @property {string} date
 * @property {string} label
 * @property {string} type
 * @property {number} amount
 * @property {string} currency - currency symbol
 * @property {string} currencyCode - ISO currency code
 * @property {string} billId - optional linked billId
 * @property {Array<BillDetails>|null} billDetails - optional bill details.
 * @property {PaymentDetails|null} payDetails - optional payment details
 */

/**
 * @typedef BillDetails
 * @type {object}
 * @property {string} label - service label. f.e. "Electric", "Gas", etc
 * @property {string} currency - currency symbol
 * @property {number} amount
 */

/**
 * @typedef TenderDetails
 * @type {object}
 * @property {string} confirmationNumber
 * @property {string} payEventId
 * @property {string} paymentId
 * @property {string|number} paymentType - Payment type identifier. f.e. 27, 34, "CREDITCARD", "SAVINGS_ACCOUNT"
 * @property {string} paymentTypeDescription - String representation of paymentType identifier.
 * @property {number} tenderAmount
 * @property {string} cardType - card type identifier, f.e. 'C1MC', 'C1VS'
 * @property {string} cardTypeDescription - card type description, f.e. 'MasterCard', 'Visa', 'Gold Dinar'
 * @property {string} last4DigitsOfCardNumber
 * @property {string} last4DigitsOfAccountNumber
 * @property {string|null} last4DigitsOfRoutingNumber
 * @property {string} bankName
 */

/**
 * Returns the financial history records for the given CC&B account which fall between
 * given startDate and endDate.
 * Both startDate and endDate are optional for now
 * @param accountId - an account to fetch data for
 * @param offset - pagination offset
 * @param limit - pagination limit
 * @param period - fetch period. "currentYear", "previousYear", or ISO-8601 period specification
 *      period=currentYear will return all entries for current year
 *      period=previousYear will return all entries for previous year
 *      period=PnYnMnD where PnYnMnD is ISO-8601 period, will return all entries starting from
 *         `today` to `today - period.length`.
 *         E.g.: for P1y2m3d will be returned all entries for last 1 year 2 month and 3 days
 * @returns {Promise<FinancialHistoryResponse>} - A promise which resolves to the the backend API
 *          response containing financial history records.
 * @see https://wiki.opower.com/pages/viewpage.action?spaceKey=PD&title=DSS+Financial+History+Endpoint
 * @see https://github.va.opower.it/digital-self-service/bill-trends-service/pull/174
 */
export const getFinancialHistory = async ({
    selectedAccountId, offset = 0, limit = null, period = null, filterCriteria = null
} = {}) => {
    const pathname =  'bill-trends-v1/cws/v2/utilities/{{clientCode}}/financialHistory';
    const {url, headers} = resolveEdgeUrlWithHeaders({
        pathname,
        query: pickNonNull({offset, limit, period, filterCriteria}),
        opts: {
            accountIds: [selectedAccountId]
        }
    });

    const response = await fetch(url, {credentials: 'include', headers: new Headers(headers)});

    if (!(response.status >= 200 && response.status < 300)) {
        let errorData;
        // In case json is not present and we need to get the text from the// response
        let clonedResponse = response.clone();

        try {
            errorData = await response.json();
        } catch (ex) {
            errorData = await clonedResponse.text();
        }
        const err = new Error(getOr(`Error fetching financial history`, 'statusText', response));

        err.details = errorData;
        throw err;
    }

    const json = await response.json();
    const validationResult = validateFinancialHistoryResponse({body: json, status: response.status});

    if (validationResult !== true) {
        const validationError = new Error('Response not valid as per schema');

        validationError.details = validationResult;
        throw validationError;
    }

    return json;
};

export const downloadFinancialHistory = async ({
    selectedAccountId, period = null
} = {}) => {
    const pathname =  'bill-trends-v1/cws/v2/utilities/{{clientCode}}/financialHistory/download';
    const {url, headers} = resolveEdgeUrlWithHeaders({
        pathname,
        query: pickNonNull({period}),
        opts: {
            accountIds: [selectedAccountId]
        }
    });

    const response = await fetch(url, {credentials: 'include', headers: new Headers(headers)});

    if (!(response.status >= 200 && response.status < 300)) {
        let errorData;
        // In case json is not present and we need to get the text from the// response
        let clonedResponse = response.clone();

        try {
            errorData = await response.json();
        } catch (ex) {
            errorData = await clonedResponse.text();
        }
        const err = new Error(getOr(`Error fetching financial history`, 'statusText', response));

        err.details = errorData;
        throw err;
    }

    const json = await response.json();
    const validationResult = validateFinancialHistoryDownloadResponse({body: json, status: response.status});

    if (validationResult !== true) {
        const validationError = new Error('Response not valid as per schema');

        validationError.details = validationResult;
        throw validationError;
    }

    return json;
};
