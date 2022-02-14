import {expect} from 'chai';
import {queryConfiguredHeaders} from './query-configured-headers';
import {CSV_HEADERS} from '../constants';

describe('queryConfiguredHeaders', () => {
    it('Should return all headers if config is empty string', () => {
        expect(queryConfiguredHeaders({widgetConfig: {csvFields: ''}})).to.be.deep.equals(CSV_HEADERS);
    });

    it('Should return only headers defined in config', () => {
        expect(queryConfiguredHeaders({widgetConfig: {csvFields: 'paymentId,billId'}}))
            .to.be.deep.equals({
                paymentId: CSV_HEADERS.paymentId,
                billId: CSV_HEADERS.billId
            });
    });
});
