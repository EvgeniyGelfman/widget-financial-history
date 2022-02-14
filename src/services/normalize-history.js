import compose from 'lodash/fp/compose';
import concat from 'lodash/fp/concat';
import cond from 'lodash/fp/cond';
import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';
import join from 'lodash/fp/join';
import stubTrue from 'lodash/fp/stubTrue';
import {normalize, schema} from 'normalizr';

const getId = cond([
    [compose(eq('PX'), get('type')), compose(join('-'), concat('PX'), get('paymentId'), get('payDetail'))],
    [compose(eq('P'), get('type')), compose(join('-'), concat('P'), get('paymentId'), get('payDetail'))],
    [stubTrue,  compose(join('-'), concat('B'), get('billId'))]
]);

export const normalizeHistory = (history) => {
    const entity = new schema.Entity(
        'history',
        {},
        {
            idAttribute: getId,
            processStrategy: (value) => {
                return {
                    ...value,
                    id: getId(value)
                };
            }
        });

    return normalize(history, new schema.Array(entity));
};
