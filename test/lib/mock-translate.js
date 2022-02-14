import isEmpty from 'lodash/fp/isEmpty';
import reduce from 'lodash/fp/reduce';
import replace from 'lodash/fp/replace';

const reduceWith = reduce.convert({cap: false});

export const mockTranslate = (key, variables) => {
    const messages = {
        'DATE_FILTER.LABEL.ALL_DATES': 'All dates',
        'DATE_FILTER.LABEL.THIS_YEAR_DATES': 'This year dates',
        'DATE_FILTER.LABEL.LAST_YEAR_DATES': 'Last year dates',
        'TRANSACTION_FILTER.LABEL.ALL_TRANSACTIONS': 'All transactions',
        'TRANSACTION_FILTER.LABEL.PAYMENTS': 'Payments',
        'TRANSACTION_FILTER.LABEL.BILLS': 'Bills',
        'TRANSACTION_FILTER.LABEL.PENDING_TRANSACTIONS': 'Pending transactions',
        'TRANSACTION_FILTER.LABEL.ADJUSTMENTS': 'Adjustments',
        'TRANSACTION_FILTER.A11Y.LABEL.SELECT_RANGE': 'Select transactions',
        'HISTORY_TABLE.HEADER.DATE': 'Date',
        'HISTORY_TABLE.HEADER.ACTIVITY': 'Activity',
        'HISTORY_TABLE.HEADER.AMOUNT': 'Amount',
        'HISTORY_TABLE.NO_DATA':
            'There are no records in the time range you selected, please select a different time range',
        'NO_DATA.HEADING': 'You don’t have any billing and payment history right now.',
        'NO_DATA.SUB_HEADING': 'When you receive your first bill or make your first payment,' +
            ' you’ll see them here.',
        'NO_DATA.RETURN_TO_OVERVIEW': 'Return to Overview',
        'HISTORY_TABLE.ACTIVITY.SCHEDULED': 'Scheduled payment',
        'HISTORY_TABLE.ACTIVITY_DETAILS.TOTAL': 'Total Bill',
        // eslint-disable-next-line quote-props
        'VIEW_BILL_DETAILS': 'View bill details',
        'CURRENCY.CURRENCY_CODE': 'USD',
        'MOMENT_DATE.SHORT_MONTH_DAY_YEAR': 'MMM D, YYYY',
        'PAGINATION_CONTROL.LABEL.A11Y.PREVIOUS_PAGE': 'Previous page',
        'PAGINATION_CONTROL.LABEL.A11Y.NEXT_PAGE': 'Next page',
        'PAGINATION_CONTROL.PROGRESS': 'Showing page {{ pageNumber }} of {{ totalPages }}',
        'PAYMENT_DETAILS.METHOD': 'Payment method',
        'PAYMENT_DETAILS.CONFIRMATION': 'Confirmation #',
        'PAYMENT_DETAILS.PAYMENT_METHOD.27': 'Checking account ending in {{ last4DigitsOfAccountNumber }}',
        'PAYMENT_DETAILS.PAYMENT_METHOD.37': 'Savings account ending in {{ last4DigitsOfAccountNumber }}',
        'PAYMENT_DETAILS.PAYMENT_METHOD.47': '{{ cardType }} ending in {{ last4DigitsOfCardNumber }}',
        'PAYMENT_DETAILS.CARD_TYPE.C1VS': 'Visa',
        'PAYMENT_DETAILS.CARD_TYPE.C1AM': 'American Express',
        'PAYMENT_DETAILS.CARD_TYPE.C1DV': 'Discover',
        'PAYMENT_DETAILS.CARD_TYPE.C1MC': 'Master Card',
        'ERROR.HEADING': 'We\'re sorry, but something went wrong.',
        'ERROR.SUB_HEADING': 'We\'re unable to retrieve your information right now.',
        'ERROR.TRY_AGAIN': 'Please try again later.',
        'HISTORY_TABLE.ACTIVITY.PAYMENT': 'Payment Received',
        'HISTORY_TABLE.ACTIVITY.PAYMENT_CANCELLED': 'Payment Cancelled',
        'HISTORY_TABLE.ACTIVITY.BILL': 'Bill Posted',
        'SCHEDULED_PAYMENT_DETAILS.ACCOUNT': 'Account# {{ accountId }}',
        // eslint-disable-next-line quote-props
        'CANCEL_PAYMENT': 'Cancel Payment',
        // eslint-disable-next-line quote-props
        'CANCEL_PAYMENT_MULTI': 'Cancel Payment (multiple accounts)',
        'SCHEDULED_PAYMENT_DETAILS.TOTAL': 'Total scheduled payment',
        'SCHEDULED_PAYMENT_DETAILS.DESCRIPTION': 'Description'
    };

    key = Array.isArray(key) ? key[0] : key;

    const messageTemplate = messages[key];

    if (isEmpty(messageTemplate)) {
        return key;
    }

    return reduceWith(
        (template, value, key) => {
            return replace(`{{ ${key} }}`, value, template);
        },
        messageTemplate,
        variables
    );
};
