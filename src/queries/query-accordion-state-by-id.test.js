import {assert} from 'chai';

import {queryAccordionStateById as subject} from './query-accordion-state-by-id';

describe('queryAccordionStateById', () => {
    it('returns correct value when entityId is present', () => {
        const state = {
            accordion: {
                0: true,
                1: false
            }
        };

        assert.isTrue(
            subject(0)(state),
            'returns correct state of accordion for a specific entityId'
        );

        assert.isFalse(
            subject(1)(state),
            'returns correct state of accordion for a specific entityId'
        );
    });

    it('returns false when state is empty or not initialized', () => {
        assert.isFalse(
            subject(null)({}),
            'returns False if the state is empty or not initialized'
        );

        assert.isFalse(
            subject(null)(null),
            'returns False if the state is null/undefined'
        );
    });
});
