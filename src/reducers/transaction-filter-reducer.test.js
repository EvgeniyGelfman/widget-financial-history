import {assert} from 'chai';
import {selectTransactionFilterAction, resetTransactionFilterAction} from '../actions';
import {transactionFilterReducer as subject} from './transaction-filter-reducer';

describe('transactionFilterReducer', () => {
    it('returns initial state when requested first time', () => {
        assert.strictEqual(
            subject(undefined, {}),
            '',
            'state should be initialized'
        );
    });

    it('returns selected tansaction', () => {
        assert.strictEqual(
            subject({}, selectTransactionFilterAction({selectedOption: 'C1BL'})),
            'C1BL',
            'selected tansaction value'
        );
    });

    it('returns resetTransactionFilterAction', () => {
        assert.strictEqual(
            subject({}, resetTransactionFilterAction({initTransactionVal: 'C1BL'})),
            'C1BL',
            'selected tansaction value will be reset'
        );
    });
});
