import maestroFixtures from 'maestro|fixtures';

import {validateFinancialHistoryDownloadResponse} from '../src/apis/schema/validate-schema';

const ANY_QUERY_PARAMS = '(?:\\?(?:[^=&]+=[^&]*&?)*)?';

maestroFixtures.addFixture({
    name: 'cws-download-financial-history-v1',
    url: new RegExp(`.*/cws/v2/utilities/([^/]*?)/financialHistory/download${ANY_QUERY_PARAMS}$`),
    validate: validateFinancialHistoryDownloadResponse,
    docs: 'https://wiki.opower.com/pages/viewpage.action?spaceKey=PD&title=DSS+Financial+History+Endpoint',
    mocks: {
        'happy-path': {
            method: 'GET',
            response: [{
                statusCode: 200,
                body: require('../fixtures/data/happy-path-download'),
                when: {
                    query: {
                        period: 'P5y'
                    }
                }
            }]
        },
        'no-data': {
            method: 'GET',
            response: {
                statusCode: 200,
                body: require('../fixtures/data/no-data')
            }
        },
        'error-response': {
            method: 'GET',
            response: {
                statusCode: 500,
                body: 'Internal server error'
            }
        }
    }
});
