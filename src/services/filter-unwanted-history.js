import anyPass from 'lodash/fp/anyPass';
import compose from 'lodash/fp/compose';
import eq from 'lodash/fp/eq';
import filter from 'lodash/fp/filter';
import get from 'lodash/fp/get';

const PayEventTypes = {
    Bill: 'C',
    Payment: 'P',
    PaymentCancelled: 'PX'
};

export const filterUnwantedHistory = filter((value) => {
    return compose(
        anyPass([
            eq(PayEventTypes.Bill),
            eq(PayEventTypes.Payment),
            eq(PayEventTypes.PaymentCancelled)
        ]),
        get('type')
    )(value);
});
