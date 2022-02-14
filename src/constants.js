import PERMISSIONS from './permissions';

export const DATE_FILTER_OPTIONS = {
    ALL_DATES: 'ALL_DATES',
    THIS_YEAR_DATES: 'THIS_YEAR_DATES',
    LAST_YEAR_DATES: 'LAST_YEAR_DATES'
};

export const FILTER_OPTIONS = DATE_FILTER_OPTIONS;

export const INIT_TRANSACTIONS = {
    ALL_TRANSACTIONS: '',
    PENDING_TRANSACTIONS: 'C1PD'
};

export const DATE_FILTER_PERIODS = {
    ALL_DATES: (numberOfViewableBillYears) => `P${numberOfViewableBillYears}y`, // last n years
    THIS_YEAR_DATES: () => 'currentYear',
    LAST_YEAR_DATES: () => 'previousYear'
};

export const FETCH_BATCH_SIZE = 15;

export {PERMISSIONS};
/**
 * As a web user i want to be able to download transactions with the following details
 * Date, reference, amount, status, Type.
 *
 * Object format should map from  `jsonPath` => `translationIdentifier`, to avoid direct mapping
 * from service response scheme to message properties.
 * See https://github.va.opower.it/digital-self-service/widget-financial-history/pull/70?#discussion_r495549 for
 * argumentation.
 *
 * In case if you need to add some additional header to CSV report - for example
 *  tenderTypeDescription from paymentMethod
 * you will need to add key `payDetail.tenderDetails.tenderTypeDescription` with value like `TENDER_DESCRIPTION`:
 * ```
 * export cont CSV_HEADERS = {
 *    payDetails: {
 *        messageKey: 'TENDER_DESCRIPTION'
 *        path: 'payDetail.tenderDetails.tenderTypeDescription',
 *        isArray: true
 *    }
 * }
 * ```
 * then add corresponding translation to message.properties:
 * ```
 * x-web.widget-financial-history.REPORT.CSV.HEADERS.TENDER_DESCRIPTION=Angebotsbeschreibung
 * ```
 *
 * Some headers might represent array or are parts of array that is more than one value can exists. Such headers should
 * be marked with `isArray` flag. The headers will stack one after another and might be represented by more than one
 * column in scv report.
 */
export const CSV_HEADERS = {
    date: {
        messageKey: 'DATE',
        path: 'date'
    },
    label: {
        messageKey: 'ACTIVITY',
        path: 'label'
    },
    amount: {
        messageKey: 'AMOUNT',
        path: 'amount'
    },
    currency: {
        messageKey: 'CURRENCY',
        path: 'currency'
    },
    currencyCode: {
        messageKey: 'CURRENCY_CODE',
        path: 'currencyCode'
    },
    paymentId: {
        messageKey: 'PAYMENT_ID',
        path: 'payDetail.paymentId'
    },
    billId: {
        messageKey: 'BILL_ID',
        path: 'billId'
    },
    last4DigitsOfAccountNumber: {
        messageKey: 'ACCOUNT_NUMBER',
        path: 'payDetail.tenderDetails.last4DigitsOfAccountNumber',
        isArray: true
    },
    bankName: {
        messageKey: 'BANK_NAME',
        path: 'payDetail.tenderDetails.bankName',
        isArray: true
    }

};
export const CSV_REPORT_FILENAME = 'report.csv';
