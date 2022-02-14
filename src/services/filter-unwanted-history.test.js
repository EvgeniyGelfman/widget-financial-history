import {assert} from 'chai';

import {filterUnwantedHistory as subject} from './filter-unwanted-history';

describe('filterUnwantedHistory', () => {
    it('filters the unwanted records', () => {
        assert.deepEqual(
            subject([{type: 'C'}, {type: 'P'}, {type: 'AD'}, {type: 'AX'}]),
            [{type: 'C'}, {type: 'P'}],
            'filters unwanted records'
        );
    });

    it('returns array unchanged if there is nothing to be filtered', () => {
        assert.deepEqual(
            subject([{type: 'P'}, {type: 'C'}, {type: 'PX'}]),
            [{type: 'P'}, {type: 'C'}, {type: 'PX'}],
            'input array is unchanged if nothing can be filtered out'
        );
    });

    it('handles unexpected input', () => {
        assert.deepEqual(subject(undefined), [], 'returns empty array for undefined input');
        assert.deepEqual(subject(null), [], 'returns empty array for null input');
        assert.deepEqual(subject([]), [], 'returns empty array for empty input');
    });
});
