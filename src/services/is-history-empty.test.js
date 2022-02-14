import {assert} from 'chai';

import {namespace} from '../namespace';

import {isHistoryEmpty as subject} from './is-history-empty';

describe('isHistoryEmpty', () => {
    it('returns the correct flag when neither history nor scheduled payments are available', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                financialHistory: {}
            }
        };

        assert.isTrue(
            subject(mockState),
            'returns true when scheduled payments and history are not available'
        );
    });

    it('returns the correct flag when history is present and scheduled payments are absent', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                dateFilter: 'ALL_DATES',
                financialHistory: {1: {id: 1}}
            }
        };

        assert.isFalse(
            subject(mockState),
            'returns false when scheduled payments are absent and history is available'
        );
    });

    it('returns the correct flag when history is absent and scheduled payments are present', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}}
                },
                financialHistory: {}
            }
        };

        assert.isFalse(
            subject(mockState),
            'returns false when scheduled payments are present and history is not available'
        );
    });

    it('returns the correct flag when something is being fetched', () => {
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

        assert.isFalse(
            subject(mockStateFetchingHistroy),
            'returns false if history is being fetched'
        );

        const mockStateFetchingScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    isFetching: true
                },
                financialHistory: {}
            }
        };

        assert.isFalse(
            subject(mockStateFetchingScheduledPayments),
            'returns false if scheduled payments are being fetched'
        );
    });
});
