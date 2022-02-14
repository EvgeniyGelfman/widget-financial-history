import {assert} from 'chai';

import {namespace} from '../namespace';

import {getHistoryPageBounds as subject} from './get-history-page-bounds';
import {DATE_FILTER_OPTIONS} from '../constants';

describe('getHistoryPageBounds', () => {
    it('returns the correct bounds when scheduled payments are present and are to be shown', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {}, 2: {}, 3: {}}
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: '',
                paginators: {
                    ALL_DATES: {
                        totalRecords: 10
                    }
                }
            }
        };

        assert.deepEqual(
            subject(5, mockState),
            {lowerOffset: 0, upperOffset: 2},
            'returns correct bounds when scheduled payments are present and are to be shown'
        );
    });

    it('returns the correct bounds when scheduled payments are absent and are to be shown', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: 'C1PS',
                paginators: {
                    'ALL_DATES#C1PS': {
                        totalRecords: 10
                    }
                }
            }
        };

        assert.deepEqual(
            subject(5, mockState),
            {lowerOffset: 0, upperOffset: 5},
            'returns correct bounds when scheduled payments are absent and are to be shown'
        );
    });

    it('returns the correct bounds when scheduled payments are present and not to be shown', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {}, 2: {}, 3: {}}
                },
                pageNumber: 1,
                dateFilter: DATE_FILTER_OPTIONS.LAST_YEAR_DATES,
                transactionFilter: 'C1AD',
                paginators: {
                    'LAST_YEAR_DATES#C1AD': {
                        totalRecords: 10
                    }
                }
            }
        };

        assert.deepEqual(
            subject(5, mockState),
            {lowerOffset: 0, upperOffset: 5},
            'returns correct bounds when scheduled payments are present and not to be shown'
        );
    });

    it('restricts at proper boundaries', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {}, 2: {}, 3: {}}
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: 'C1PS',
                paginators: {
                    'ALL_DATES#C1PS': {
                        totalRecords: 7
                    }
                }
            }
        };

        assert.deepEqual(
            subject(15, mockState),
            {lowerOffset: 0, upperOffset: 7},
            'returns correct bounds restricted at proper boundaries'
        );
    });

    it('returns correct bounds for a page where we have enough scheduled payments for that page', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {}, 2: {}, 3: {}}
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: '',
                paginators: {
                    ALL_DATES: {
                        totalRecords: 7
                    }
                }
            }
        };

        assert.deepEqual(
            subject(3, mockState),
            {lowerOffset: 0, upperOffset: 0},
            'returns correct bounds for a page where we have enough scheduled payments for entire page'
        );
    });
});
