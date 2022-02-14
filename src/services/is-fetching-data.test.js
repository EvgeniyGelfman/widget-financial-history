import {assert} from 'chai';

import {namespace} from '../namespace';

import {isFetchingData as subject} from './is-fetching-data';

describe('isFetchingData', () => {
    it('returns the correct flag when history is being fetched', () => {
        const mockStateFetchingHistroy = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'THIS_YEAR_DATES#PAYMENTS': {
                        id: 'THIS_YEAR_DATES#PAYMENTS',
                        isFetching: true
                    }
                }
            }
        };

        assert.isTrue(
            subject(mockStateFetchingHistroy),
            'returns true if history is being fetched'
        );
    });

    it('returns the correct flag when scheduled payments are being fetched', () => {
        const mockStateFetchingScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    isFetching: true
                },
                financialHistory: {}
            }
        };

        assert.isTrue(
            subject(mockStateFetchingScheduledPayments),
            'returns false if scheduled payments are being fetched'
        );
    });

    it('returns the correct flag when nothing is being fetched', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                dateFilter: 'THIS_YEAR_DATES',
                paginators: {
                    THIS_YEAR_DATES: {
                        id: 'THIS_YEAR_DATES',
                        isFetching: false
                    }
                }
            }
        };

        assert.isFalse(
            subject(mockState),
            'returns false if nothing is being fetched'
        );
    });
});
