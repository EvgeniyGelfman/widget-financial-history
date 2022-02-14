import {assert} from 'chai';

import {toggleAccordionAction} from '../actions';

import {accordionReducer as subject} from './accordion-reducer';

describe('accordionReducer', () => {

    it('returns initial state when undefined state is passed', () => {
        assert.deepEqual(
            subject(undefined, {}),
            {},
            'initial state is returned when undefined state is passed'
        );
    });

    it('returns True when toggling a row for the first time', () => {
        assert.deepEqual(
            subject({}, toggleAccordionAction({entityId: 0})),
            {0: true},
            'returns True when toggling a row for the first time'
        );
    });

    it('toggling a row\'s state correctly', () => {
        assert.deepEqual(
            subject({0: false}, toggleAccordionAction({entityId: 0})),
            {0: true},
            'toggling a row\'s state from False to True'
        );

        assert.deepEqual(
            subject({0: true}, toggleAccordionAction({entityId: 0})),
            {0: false},
            'toggling row\'s state from True to False'
        );
    });

    it('merges the states correctly while receiving new entityId with previous state', () => {
        assert.deepEqual(
            subject({0: false}, toggleAccordionAction({entityId: 1})),
            {0: false, 1: true},
            'state was merged correctly'
        );
    });

    it('leaves state untouched for an arbitrary action', () => {
        assert.deepEqual(
            subject({0: false, 1: false}, {type: 'Arbitrary'}),
            {0: false, 1: false},
            'state was untouched after an arbitrary action was fired'
        );
    });
});
