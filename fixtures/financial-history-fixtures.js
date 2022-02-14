import eq from 'lodash/fp/eq';
import isNil from 'lodash/fp/isNil';

import url from '@opower/url';

import maestroFixtures from 'maestro|fixtures';

import {validateFinancialHistoryResponse} from '../src/apis/schema/validate-schema';

const ANY_QUERY_PARAMS = '(?:\\?(?:[^=&]+=[^&]*&?)*)?';

maestroFixtures.addFixture({
    name: 'cws-financial-history-v1',
    url: new RegExp(`.*/cws/v2/utilities/([^/]*?)/financialHistory${ANY_QUERY_PARAMS}$`),
    validate: validateFinancialHistoryResponse,
    docs: 'https://wiki.opower.com/pages/viewpage.action?spaceKey=PD&title=DSS+Financial+History+Endpoint',
    mocks: {
        'happy-path': {
            method: 'GET',
            response: () => {
                return [{
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-all-dates-adjustments'),
                    when: {
                        query: {
                            filterCriteria: 'C1AD',
                            period: 'P5y',
                            offset: '0'
                        }
                    }
                }, {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path'),
                    when: {
                        query: {
                            filterCriteria: '',
                            period: 'P5y',
                            offset: '0'
                        }
                    }
                }, {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-all-dates-bills'),
                    when: {
                        query: {
                            filterCriteria: 'C1BL',
                            period: 'P5y',
                            offset: '0'
                        }
                    }
                }, {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-this-year'),
                    when: {
                        query: {
                            filterCriteria: '',
                            period: 'currentYear',
                            offset: '0'
                        }
                    }
                },
                {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-bills'),
                    when: {
                        query: {
                            filterCriteria: 'C1BL',
                            period: 'currentYear'
                        }
                    }
                },
                {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-payments'),
                    when: {
                        query: {
                            filterCriteria: 'C1PS'
                        }
                    }
                },
                {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-last-year')
                }, {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path'),
                    when: {
                        query: {
                            offset: '0',
                            limit: '15'
                        }
                    }
                }, {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path'),
                    when: {
                        query: {
                            offset: '0',
                            period: 'P5y'
                        }
                    }
                }];
            }
        },
        'happy-path-no-transactions': {
            method: 'GET',
            response: () => {
                return  [{
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-no-transactions-this-year'),
                    when: {
                        query: {
                            period: 'currentYear'
                        }
                    }
                },
                {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-no-transactions-last-year'),
                    when: {
                        query: {
                            period: 'previousYear'
                        }
                    }
                },
                {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path-no-transactions')
                }
                ];
            }
        },
        'multiple-payment-methods': {
            method: 'GET',
            response: [{
                statusCode: 200,
                body: require('../fixtures/data/multiple-payment-methods')
            }]
        },
        'paginated-response': {
            method: 'GET',
            response: (request) => {
                const {query: {offset}} = url.parse(request.url);

                if (isNil(offset) || offset === '0') {
                    return {
                        statusCode: 200,
                        body: require('../fixtures/data/pagination-first-page')
                    };
                }

                return {
                    statusCode: 200,
                    body: require('../fixtures/data/pagination-next-page')
                };
            }
        },
        'pagination-with-second-page-in-error': {
            method: 'GET',
            response: (request) => {
                const {query: {offset}} = url.parse(request.url);

                if (isNil(offset) || offset === '0') {
                    return {
                        statusCode: 200,
                        body: require('../fixtures/data/pagination-first-page')
                    };
                }

                return {
                    statusCode: 500,
                    body: 'Internal server error'
                };
            }
        },
        'no-last-year-history': {
            method: 'GET',
            response: (request) => {
                const {query: {period}} = url.parse(request.url);

                if (eq(period, 'previousYear')) {
                    return {
                        statusCode: 200,
                        body: require('../fixtures/data/no-data')
                    };
                }

                return {
                    statusCode: 200,
                    body: require('../fixtures/data/happy-path')
                };
            }
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
