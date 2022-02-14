import {assert} from 'chai';

import {queryFinancialHistory as subject} from './query-financial-history';

describe('queryFinancialHistory', () => {
    it('handles empty state', () => {
        assert.deepEqual(
            subject({}),
            [],
            'returns empty array when empty state is given'
        );
    });

    it('returns correct data from the state', () => {
        assert.deepEqual(
            subject({financialHistory: {1: {id: 1}, 2: {id: 2}}}),
            [{id: 1}, {id: 2}],
            'returns correct records from the state'
        );
    });
});
