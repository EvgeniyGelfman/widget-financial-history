import {assert} from 'chai';

import {namespace} from '../namespace';

import {getScheduledPaymentsPageBounds as subject} from './get-scheduled-payments-page-bounds';
import {DATE_FILTER_OPTIONS} from '../constants';

describe('getScheduledPaymentsPageBounds', () => {
    it('returns the correct bounds when scheduled payments are present and are to be shown', () => {
        const mockState = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {}, 2: {}, 3: {}}
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: ''
            }
        };

        assert.deepEqual(
            subject(5, mockState),
            {lowerOffset: 0, upperOffset: 3},
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
                transactionFilter: ''
            }
        };

        assert.deepEqual(
            subject(5, mockState),
            {lowerOffset: 0, upperOffset: 0},
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
                dateFilter: DATE_FILTER_OPTIONS.LAST_YEAR_DATES
            }
        };

        assert.deepEqual(
            subject(5, mockState),
            {lowerOffset: 0, upperOffset: 0},
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
                transactionFilter: ''
            }
        };

        assert.deepEqual(
            subject(5, mockState),
            {lowerOffset: 0, upperOffset: 3},
            'returns correct bounds when scheduled payments are present and are to be shown'
        );
    });
});
