import {assert} from 'chai';

import {queryTotalNumberOfPages as subject} from './query-total-number-of-pages';

describe('queryTotalNumberOfPages', () => {
    it('handles empty state', () => {
        assert.strictEqual(
            subject({
                numberOfRecordsPerPage: 2,
                shouldShowScheduledPayments: true,
                numberOfScheduledPayments: 5
            })({}),
            3,
            'returns pages based on number of scheduled payments when financial history state is empty'
        );
    });

    it('returns the correct number of pages when scheduled payments are present and are to be shown', () => {
        const mockState = {
            dateFilter: 'ALL_DATES',
            transactionFilter: 'PAYMENTS',
            paginators: {
                'ALL_DATES#PAYMENTS': {
                    totalRecords: 10
                }
            }
        };

        assert.strictEqual(
            subject({
                numberOfRecordsPerPage: 2,
                shouldShowScheduledPayments: true,
                numberOfScheduledPayments: 5
            })(mockState),
            8,
            'returns correct number of pages when scheduled payments are present and are to be shown'
        );
    });

    it('returns the correct number of pages when scheduled payments are absent and are to be shown', () => {
        const mockState = {
            dateFilter: 'ALL_DATES',
            transactionFilter: 'PAYMENTS',
            paginators: {
                'ALL_DATES#PAYMENTS': {
                    totalRecords: 10
                }
            }
        };

        assert.strictEqual(
            subject({
                numberOfRecordsPerPage: 2,
                shouldShowScheduledPayments: true,
                numberOfScheduledPayments: 0
            })(mockState),
            5,
            'returns correct number of pages when scheduled payments are absent and are to be shown'
        );
    });

    it('returns the correct number of pages when scheduled payments are present and not to be shown', () => {
        const mockState = {
            dateFilter: 'ALL_DATES',
            transactionFilter: 'PAYMENTS',
            paginators: {
                'ALL_DATES#PAYMENTS': {
                    totalRecords: 10
                }
            }
        };

        assert.strictEqual(
            subject({
                numberOfRecordsPerPage: 2,
                shouldShowScheduledPayments: false,
                numberOfScheduledPayments: 5
            })(mockState),
            5,
            'returns correct number of pages when scheduled payments are present and not to be shown'
        );
    });
});
