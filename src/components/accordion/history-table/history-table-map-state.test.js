import {assert} from 'chai';

import {namespace} from '../../namespace';

import {mapStateToTarget as subject} from '.';

describe('HistoryTable - mapStateToTarget', () => {
    it('correctly determines if fetch is in progress', () => {
        const mockStateScheduledPaymentsFetching = {
            [namespace]: {
                scheduledPayments: {
                    isFetching: true
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        isFetching: false
                    }
                }
            }
        };

        let result = subject(mockStateScheduledPaymentsFetching, {numberOfRecordsPerPage: 2});

        assert.isTrue(
            result.isFetching,
            'calculates isFetching correctly when scheduled payments are being fetched'
        );

        const mockStateHistoryFetching = {
            [namespace]: {
                scheduledPayments: {
                    isFetching: false
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        isFetching: true
                    }
                }
            }
        };

        result = subject(mockStateHistoryFetching, {numberOfRecordsPerPage: 2});

        assert.isTrue(
            result.isFetching,
            'calculates isFetching correctly when history is being fetched'
        );
    });

    it('correctly calculates pagination visibility flag', () => {
        const mockStateWithMultiPageData = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}, 2: {id: 2}}
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        totalRecords: 3
                    }
                }
            }
        };

        let result = subject(mockStateWithMultiPageData, {numberOfRecordsPerPage: 2});

        assert.isTrue(
            result.shouldShowPagination,
            'calculates shouldShowPagination correctly discounting for scheduled payments'
        );

        const mockStateWithSinglePageData = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        totalRecords: 2
                    }
                }
            }
        };

        result = subject(mockStateWithSinglePageData, {numberOfRecordsPerPage: 2});

        assert.isFalse(
            result.shouldShowPagination,
            'calculates shouldShowPagination correctly when only one page worth of data is present'
        );

        const mockStateWithoutData = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        totalRecords: 0
                    }
                }
            }
        };

        result = subject(mockStateWithoutData, {numberOfRecordsPerPage: 2});

        assert.isFalse(
            result.shouldShowPagination,
            'calculates shouldShowPagination correctly when no data is present'
        );
    });

    it('correctly calculates no-data visibility flag', () => {
        let mockStateWithScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}, 2: {id: 2}},
                    isFetching: false
                },
                pageNumber: 1,
                dateFilter: 'LAST_YEAR_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'LAST_YEAR_DATES#PAYMENTS': {
                        id: 'LAST_YEAR_DATES#PAYMENTS',
                        totalRecords: 0,
                        isFetching: false
                    }
                }
            }
        };

        let result = subject(mockStateWithScheduledPayments, {numberOfRecordsPerPage: 2});

        assert.isTrue(
            result.shouldShowNoFilteredData,
            'calculates shouldShowNoFilteredData flag correctly when date filter has no data ' +
                'and hidden scheduled payments'
        );

        mockStateWithScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}, 2: {id: 2}},
                    isFetching: false
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: '',
                paginators: {
                    ALL_DATES: {
                        id: 'ALL_DATES',
                        totalRecords: 0,
                        isFetching: false
                    }
                }
            }
        };

        result = subject(mockStateWithScheduledPayments, {numberOfRecordsPerPage: 2});
        assert.isFalse(
            result.shouldShowNoFilteredData,
            'calculates shouldShowNoFilteredData flag correctly when date filter has no data but ' +
                'scheduled payments are displayed'
        );

        mockStateWithScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}, 2: {id: 2}},
                    isFetching: false
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: 'C1PD',
                paginators: {
                    'ALL_DATES#C1PD': {
                        id: 'ALL_DATES#C1PD',
                        totalRecords: 0,
                        isFetching: false
                    }
                }
            }
        };

        result = subject(mockStateWithScheduledPayments, {numberOfRecordsPerPage: 2});
        assert.isFalse(
            result.shouldShowNoFilteredData,
            'calculates shouldShowNoFilteredData flag correctly when date filter has no data but ' +
                'scheduled payments are displayed'
        );

        mockStateWithScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}, 2: {id: 2}},
                    isFetching: false
                },
                pageNumber: 1,
                dateFilter: 'LAST_YEAR_DATES',
                transactionFilter: 'C1PD',
                paginators: {
                    'LAST_YEAR_DATES#C1PD': {
                        id: 'LAST_YEAR_DATES#C1PD',
                        totalRecords: 0,
                        isFetching: false
                    }
                }
            }
        };

        result = subject(mockStateWithScheduledPayments, {numberOfRecordsPerPage: 2});
        assert.isTrue(
            result.shouldShowNoFilteredData,
            'calculates shouldShowNoFilteredData flag correctly when date filter has no data but ' +
                'scheduled payments are displayed'
        );

        let mockStateWithDataFetching = {
            [namespace]: {
                scheduledPayments: {
                    isFetching: true
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        isFetching: false
                    }
                }
            }
        };

        result = subject(mockStateWithDataFetching, {numberOfRecordsPerPage: 2});
        assert.isFalse(
            result.shouldShowNoFilteredData,
            'calculates shouldShowNoFilteredData flag when scheduled payments are being fetched'
        );

        mockStateWithDataFetching = {
            [namespace]: {
                scheduledPayments: {
                    isFetching: false,
                    entities: {}
                },
                pageNumber: 1,
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        isFetching: true
                    }
                }
            }
        };

        result = subject(mockStateWithDataFetching, {numberOfRecordsPerPage: 2});
        assert.isFalse(
            result.shouldShowNoFilteredData,
            'calculates shouldShowNoFilteredData flag when filter data is being fetched'
        );
    });

    it('correctly calculates visibility flag', () => {
        let mockStateWithScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}, 2: {id: 2}}
                },
                pageNumber: 1,
                dateFilter: 'THIS_YEAR_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'THIS_YEAR_DATES#PAYMENTS': {
                        id: 'THIS_YEAR_DATES#PAYMENTS',
                        firstTimeError: 'error'
                    }
                }
            }
        };

        let result = subject(mockStateWithScheduledPayments, {numberOfRecordsPerPage: 2});

        assert.isFalse(
            result.visible,
            'calculates visibility flag correctly when scheduled payments are present but first time error is present'
        );

        mockStateWithScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    entities: {1: {id: 1}, 2: {id: 2}}
                },
                pageNumber: 2,
                dateFilter: 'ALL_DATES',
                transactionFilter: '',
                paginators: {
                    ALL_DATES: {
                        id: 'ALL_DATES',
                        firstTimeError: null,
                        errors: ['some error', 'some error'],
                        totalRecords: 2
                    }
                }
            }
        };

        result = subject(mockStateWithScheduledPayments, {numberOfRecordsPerPage: 2});

        assert.isFalse(
            result.visible,
            'calculates visibility flag correctly when date filter has errors for current page and ' +
            'scheduled payments are present'
        );

        let mockStateWithoutScheduledPayments = {
            [namespace]: {
                scheduledPayments: {
                    entities: {}
                },
                pageNumber: 1,
                financialHistory: {},
                dateFilter: 'ALL_DATES',
                transactionFilter: 'PAYMENTS',
                paginators: {
                    'ALL_DATES#PAYMENTS': {
                        id: 'ALL_DATES#PAYMENTS',
                        isFetching: false,
                        totalRecords: 0
                    }
                }
            }
        };

        result = subject(mockStateWithoutScheduledPayments, {numberOfRecordsPerPage: 2});

        assert.isFalse(
            result.visible,
            'calculates visibility flag correctly when no history is present'
        );
    });
});
