import {assert} from 'chai';

import {queryPageNumber as subject} from './query-page-number';

describe('queryPageNumber', () => {
    it('handles empty state', () => {
        assert.isUndefined(
            subject({}),
            'returns undefined when state is empty'
        );
    });

    it('returns correct value from state', () => {
        assert.strictEqual(
            subject({pageNumber: 1}),
            1,
            'returns correct page number from state'
        );
    });
});
