import {assert} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as sinon from 'sinon';

import filesaver from 'filesaver.js';

import {downloadReportThunk} from './download-history-thunk';
import fetchMock from 'fetch-mock';
import {fetchHistoryStarted, fetchHistorySuccess} from '../action-creators';

const createMockStore = configureMockStore([thunk]);

describe('fetchFinancialHistoryIfNecessary - dispatch', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('Executing saveAs with correctly generated CSV on success download', async () => {

        fetchMock.get(/download/, {
            recentDate: 'day after tomorrow',
            pastDate: 'yesterday',
            offset: 0,
            totalRecords: 2,
            history: [{
                date: '2017-04-26',
                label: 'Bill',
                type: 'C',
                amount: -111.5,
                currency: '$',
                currencyCode: 'USD',
                billId: '-bill-id-to-search-for-',
                payDetail: null
            }, {
                date: '2017-04-26',
                label: 'Payment reversed',
                type: 'PR',
                amount: -111.5,
                currency: '$',
                currencyCode: 'USD',
                billId: null,
                payDetail: {
                    paymentId: '-payment-id-to-search-for-'
                }
            }]
        }, {
            query: {
                period: 'P3y'
            }
        });

        const translations = {
            paymentId: 'Payment ID',
            billId: 'Bill ID'
        };
        const store = createMockStore({});

        filesaver.saveAs = sinon.spy();

        const dispathed = await store.dispatch(downloadReportThunk({
            filename: 'filename.csv',
            numberOfViewableBillYears: 3,
            headers: ['paymentId', 'billId'],
            translateHeaders: (header) => translations[header] || `untranslated ${header}`
        }));

        assert.equal(dispathed.type, fetchHistorySuccess().type);
        assert.deepEqual(store.getActions().map(action => ({type: action.type})), [ // ignore action payload
            fetchHistoryStarted(),
            fetchHistorySuccess()
        ]);
        assert.isTrue(filesaver.saveAs.called);

        const [blob, filename, opts]  = filesaver.saveAs.getCall(0).args;
        const csv = await blob.text();

        const expectedCallArgs = [
            `Payment ID,Bill ID\r\n,-bill-id-to-search-for-`,
            'filename.csv',
            {autoBom: true}
        ];

        assert.deepEqual([csv, filename, opts], expectedCallArgs);
        assert.isTrue(true);

        const lastUrl = fetchMock.lastUrl();

        assert.isTrue(lastUrl.includes('period=P3y'));
    });
});
