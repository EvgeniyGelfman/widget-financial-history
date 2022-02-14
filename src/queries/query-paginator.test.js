import {assert} from 'chai';
import {placeholder as _} from 'lodash/fp/curry';

import {queryPaginator as subject} from './query-paginator';

const paginators = {
    ALL_DATES: {
        id: 'ALL_DATES',
        someprop: 'somevalue',
        totalRecords: 3
    },
    THIS_YEAR_DATES: {
        id: 'THIS_YEAR_DATES',
        someprop: 'somevalue',
        totalRecords: 1
    }
};

describe('queryPaginator', () => {
    it('handles empty state', () => {
        assert.isUndefined(
            subject('ALL_DATES', {}),
            'return undefined when state is empty'
        );
    });

    it('returns correct value based on requested paginator Id', () => {
        assert.deepEqual(
            subject('ALL_DATES', {paginators}),
            paginators.ALL_DATES,
            'returns correct paginator slice from state'
        );

        assert.deepEqual(
            subject('THIS_YEAR_DATES', {paginators}),
            paginators.THIS_YEAR_DATES,
            'returns correct paginator slice from updated state'
        );
    });

    it( 'can be used as partial(curried) func', () => {
        const state = {paginators};

        assert.equal(
            subject('THIS_YEAR_DATES')(state),
            paginators.THIS_YEAR_DATES,
            'returns correct paginator slice from state if using placeholder/curried version'
        );

        const subject1 = subject(_, state);

        assert.deepEqual(
            subject1('ALL_DATES'),
            paginators.ALL_DATES,
            'returns correct paginator slice from state if using placeholder/curried version'
        );
    });

    it('can be used to query specific paginator prop', () => {
        const state = {paginators};

        assert.equal(
            subject(['THIS_YEAR_DATES', 'totalRecords'])(state),
            paginators.THIS_YEAR_DATES.totalRecords,
            'returns correct paginator slice from state if using placeholder/curried version'
        );
    });
});
