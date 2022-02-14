import {assert} from 'chai';

import {downloadHistoryReducer as subject} from './download-history-reducer';
import {
    fetchHistoryError,
    fetchHistoryStarted,
    fetchHistorySuccess
} from '../actions/action-creators';

describe('download-history-reducer', () => {

    it('returns initial state when undefined state is passed', () => {
        assert.deepEqual(
            subject(undefined, {}),
            {
                isLoading: false,
                error: null,
                isSuccess: false
            },
            'initial state is returned when undefined state is passed'
        );
    });

    it ('isLoading when fetch started', () => {
        assert.deepEqual(
            subject({}, fetchHistoryStarted()),
            {
                isLoading: true,
                error: null,
                isSuccess: false
            },
            'set isLoading if fetch started'
        );
    });

    it ('isSuccess when fetch success', () => {
        assert.deepEqual(
            subject({
                error: 'notnull',
                isSuccess: false,
                isLoading: true
            }, fetchHistorySuccess()),
            {
                isLoading: false,
                error: null,
                isSuccess: true
            },
            'isSuccess when fetch success'
        );
    });

    it ('update error state in case of error', () => {
        assert.deepEqual(
            subject({
                error: 'notnull',
                isSuccess: true,
                isLoading: true
            }, fetchHistoryError('AnotherError')),
            {
                error: 'AnotherError',
                isSuccess: false,
                isLoading: false
            },
            'isSuccess when fetch success'
        );
    });
});
