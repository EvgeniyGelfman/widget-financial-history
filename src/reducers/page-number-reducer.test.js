import {assert} from 'chai';

import {
    goToNextPageAction as goToNextPage,
    goToPreviousPageAction as goToPreviousPage,
    selectDateFilterAction
} from '../actions';

import {pageNumberReducer as subject} from './page-number-reducer';

describe('pageNumberReducer', () => {

    it('returns initial state when requested first time', () => {
        assert.strictEqual(
            subject(undefined, {}),
            1,
            'state should be initialized'
        );
    });

    it('handles next page action', () => {
        assert.strictEqual(
            subject(1, goToNextPage({totalPages: 3})),
            2,
            'returns correct page number when next page action is fired'
        );

        assert.strictEqual(
            subject(3, goToNextPage({totalPages: 3})),
            3,
            'returns clamped page number when already on the last page and next page action is fired'
        );
    });

    it('handles previous page action', () => {
        assert.strictEqual(
            subject(2, goToPreviousPage({totalPages: 3})),
            1,
            'returns correct page number when previous page action is fired'
        );

        assert.strictEqual(
            subject(1, goToPreviousPage({totalPages: 3})),
            1,
            'returns clamped page number when already on first page and previous page action is fired'
        );
    });

    it('resets to first page when selectDateFilter action is fired', () => {
        assert.strictEqual(
            subject(3, selectDateFilterAction()),
            1,
            'resets the page number to first page when selectDateFilterAction is fired'
        );
    });

    it('returns unchanged state when OTHER action is passed', () => {
        assert.strictEqual(subject(2, {type: 'DUMMY_ACTION'}), 2, 'state was unchanged');
    });
});
