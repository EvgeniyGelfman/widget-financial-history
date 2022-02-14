import {assert} from 'chai';

import {removeUnwantedFilters as subject} from './remove-unwanted-filters';

describe('removeUnwantedFilters', () => {
    it('filters the unwanted records', () => {
        assert.deepEqual(
            subject([
                {filterType: 'C1AD', filterTypeDescription: 'Adjustments'},
                {filterType: 'C1PS', filterTypeDescription: 'Payments'},
                {filterType: 'C1BL', filterTypeDescription: 'Bills'}
            ]),
            [
                {filterType: 'C1PS', filterTypeDescription: 'Payments'},
                {filterType: 'C1BL', filterTypeDescription: 'Bills'}
            ],
            'filters unwanted records'
        );
    });

    it('returns array unchanged if there is nothing to be filtered', () => {
        assert.deepEqual(
            subject([
                {filterType: 'C1AL', filterTypeDescription: 'All tranasactions'},
                {filterType: 'C1PS', filterTypeDescription: 'Payments'},
                {filterType: 'C1BL', filterTypeDescription: 'Bills'}
            ]),
            [
                {filterType: 'C1AL', filterTypeDescription: 'All tranasactions'},
                {filterType: 'C1PS', filterTypeDescription: 'Payments'},
                {filterType: 'C1BL', filterTypeDescription: 'Bills'}
            ],
            'input array is unchanged if nothing can be filtered out'
        );
    });

    it('handles unexpected input', () => {
        assert.deepEqual(subject(undefined), [], 'returns empty array for undefined input');
        assert.deepEqual(subject(null), [], 'returns empty array for null input');
        assert.deepEqual(subject([]), [], 'returns empty array for empty input');
    });
});
