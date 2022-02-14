import {assert} from 'chai';
import fetchMock from 'fetch-mock';
import moment from 'moment-timezone';

import url from '@opower/url';

import {getFinancialHistory as subject} from '.';

describe('api - getFinancialHistory', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('fetches financial history', async () => {
        fetchMock.get(/financialHistory/, {
            recentDate: moment().format('YYYY-MM-DD'),
            pastDate: moment().subtract(5, 'years').format('YYYY-MM-DD'),
            offset: 0,
            totalRecords: 1,
            history: [{
                date: '2017-04-26',
                label: 'Bill',
                type: 'C',
                amount: -111.5,
                currency: '$',
                currencyCode: 'USD',
                billId: null,
                billDetails: []
            }]
        });

        const response = await subject({});
        const history = response.history;

        assert.deepEqual(
            history,
            [{
                date: '2017-04-26',
                label: 'Bill',
                type: 'C',
                amount: -111.5,
                currency: '$',
                currencyCode: 'USD',
                billId: null,
                billDetails: []
            }],
            'fetches financial history'
        );
    });

    it('rejects the promise if error response is received', async () => {
        fetchMock.get(/financialHistory/, 500);

        try {
            await subject({});

            assert.fail('should not reach here');
        } catch (error) {
            assert.strictEqual(
                error.message,
                'Internal Server Error',
                'promise is rejected when network call fails'
            );
        }
    });

    it('rejects the promise if schema validation for mandatory field(s) failed', async () => {
        fetchMock.get(/financialHistory/, {
            status: 200,
            body: {
                pastDate: '2017-10-01', // we purposefully missing the "recentDate" field, which is mandatory
                offset: 0,
                totalRecords: 0,
                history: []
            }
        });

        try {
            await subject({offset: 0, limit: 50});

            assert.fail('should not reach here');
        } catch (error) {
            assert.strictEqual(
                error.message,
                'Response not valid as per schema',
                'promise is rejected when response does not contain the mandatory field(s)'
            );
        }
    });

    it('rejects the promise if schema validation for conditionally mandatory field(s) failed', async () => {
        fetchMock.get(/financialHistory/, {
            status: 200,
            body: {
                recentDate: '2018-10-01',
                pastDate: '2017-10-01',
                offset: 0, // we purposefully missing the "totalRecords" field, which is mandatory when "offset" = "0"
                history: []
            }
        });

        try {
            await subject({offset: 0, limit: 50});

            assert.fail('should not reach here');
        } catch (error) {
            assert.strictEqual(
                error.message,
                'Response not valid as per schema',
                'promise is rejected when response does not contain the conditionally mandatory field(s)'
            );
        }

        fetchMock.restore();

        fetchMock.get(/financialHistory/, {
            status: 200,
            body: {
                recentDate: '2018-10-01',
                pastDate: '2017-10-01',
                offset: 0,
                totalRecords: 0, // now we provide "totalRecords" field
                history: []
            }
        });

        const response = await subject({recentDate: '2018-10-01', pastDate: '2017-10-01', offset: 0, limit: 50});

        assert.isTrue(fetchMock.called(), 'fetch was called');
        assert.deepEqual(response.history, [], 'fetches financial history successfully if the condition is fulfilled');
    });

    it('passes correct query parameters', async () => {
        fetchMock.get(/financialHistory/, {
            status: 200,
            body: {
                recentDate: '2018-10-01',
                pastDate: '2017-10-01',
                offset: 0,
                totalRecords: 0,
                history: []
            }
        });
        await subject({period: 'currentYear', offset: 1, limit: 50});

        assert.isTrue(fetchMock.called(), 'fetch was called');
        assert.deepEqual(
            url.parse(fetchMock.lastUrl()).query,
            {period: 'currentYear', offset: '1', limit: '50'},
            'passes all argument values correctly as string if they are provided'
        );
    });

    it('does not crash if billDetails are empty when fetching history', async () => {
        const responseMock = {
            recentDate: moment().format('YYYY-MM-DD'),
            pastDate: moment().subtract(5, 'years').format('YYYY-MM-DD'),
            offset: 0,
            totalRecords: 1,
            history: [{
                date: '2017-04-26',
                label: 'Bill',
                type: 'C',
                amount: -111.5,
                currency: '$',
                currencyCode: 'USD',
                billId: 'someBillId'
            }, {
                date: '2017-04-26',
                label: 'Bill',
                type: 'C',
                amount: null,
                currency: '$',
                currencyCode: 'USD',
                billId: 'notNull',
                billDetails: null
            }, {
                date: '2019-01-10',
                label: 'Bill',
                type: 'C',
                amount: null,
                currency: '$',
                currencyCode: 'USD',
                billId: '051058226396',
                billDetails: [],
                payDetail: null
            }]
        };

        fetchMock.get(/financialHistory/, responseMock);

        const response = await subject({});
        const history = response.history;

        assert.deepEqual(
            history,
            response.history,
            'API schema validators should allow empty billDetails as per DSS-14268'
        );
    });

});
