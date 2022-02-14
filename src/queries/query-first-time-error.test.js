import {assert} from 'chai';

import {queryFirstTimeError as subject} from './query-first-time-error';

describe('queryFirstTimeError', () => {
    it('handles empty state', () => {
        assert.isUndefined(
            subject({}),
            'returns undefined when empty state is given'
        );
    });

    it('returns error for correct paginator', () => {
        assert.strictEqual(
            subject({
                paginators: {
                    'ALL_DATES#ALL_TRANSACTIONS': {
                        firstTimeError: 'internal error'
                    },
                    'ALL_DATES#PAYMENTS': {
                        firstTimeError: 'internal error'
                    },
                    'ALL_DATES#BILLS': {
                        errors: ['another error']
                    },
                    'ALL_DATES#PENDING_TRANSACTIONS': {
                        firstTimeError: 'some error'
                    },
                    'ALL_DATES#ADJUSTMENTS': {
                        firstTimeError: 'some error'
                    },
                    'THIS_YEAR_DATES#ALL_TRANSACTIONS': {
                        firstTimeError: 'some error'
                    },
                    'THIS_YEAR_DATES#PAYMENTS': {
                        firstTimeError: 'some error'
                    },
                    'THIS_YEAR_DATES#BILLS': {
                        firstTimeError: 'some error'
                    },
                    'THIS_YEAR_DATES#PENDING_TRANSACTIONS': {
                        firstTimeError: 'some error'
                    },
                    'THIS_YEAR_DATES#ADJUSTMENTS': {
                        firstTimeError: 'some error'
                    },
                    'LAST_YEAR_DATES#ALL_TRANSACTIONS': {
                        firstTimeError: 'some error'
                    },
                    'LAST_YEAR_DATES#PAYMENTS': {
                        firstTimeError: 'some error'
                    },
                    'LAST_YEAR_DATES#BILLS': {
                        firstTimeError: 'some error'
                    },
                    'LAST_YEAR_DATES#PENDING_TRANSACTIONS': {
                        firstTimeError: 'some error'
                    },
                    'LAST_YEAR_DATES#ADJUSTMENTS': {
                        firstTimeError: 'some error'
                    }
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS'
            }),
            'internal error',
            'returns first time error for correct paginator'
        );
    });
});
