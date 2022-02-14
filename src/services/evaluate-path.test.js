import {evaluatePath as subject} from './json2csv';

describe('evaluatePath', async () => {
    it('sanity check', async () => {

        assert.equal(
            subject('foo.bar', {foo: {bar: '12'}}),
            '12'
        );

        assert.equal(
            subject('length', [1, 2, 3]),
            3
        );

        assert.deepEqual(
            subject('payEventDetails.payments.amount', {
                payEventDetails: {
                    payments: [
                        {amount: 20},
                        {amount: 30},
                        {amount: 40},
                        {services: 3}
                    ]
                }
            }),
            [20, 30, 40, undefined]
        );

        assert.deepEqual(
            subject('payEventDetails.payments.service', {
                payEventDetails: {
                    payments: [
                        {amount: 20, service: 'stone therapy'},
                        {amount: 30, service: 'massage'},
                        {amount: 40, service: 'buddha blessing'},
                        {service: 'nirvana', amount: 50}
                    ]
                }
            }),
            [
                'stone therapy',
                'massage',
                'buddha blessing',
                'nirvana'
            ]
        );
    });
});
