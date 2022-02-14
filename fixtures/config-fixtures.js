import maestroFixtures from 'maestro|fixtures';

const experiences = {
    billingAndPaymentOverview: {
        contentPath: 'portal/accounts/pages_mainMenu/billingpaymentlink/currentbill'
    },
    accountOverview: {
        contentPath: 'portal/accounts/home'
    },
    billHistory: {
        contentPath: 'portal/accounts/billhistory'
    },
    cancelScheduledPayment: {
        contentPath: 'portal/accounts/cancelpayment'
    }
};

maestroFixtures.addRuntimeFixture({
    name: 'widget-financial-history-config-fixtures',
    description: 'Maestro Runtime Config',
    mocks: {
        withExperiences: {
            config: {
                experiences,
                'widget-financial-history': {
                    csvFields: 'date,label,amount,currency,currencyCode,billId,' +
                        'paymentId,last4DigitsOfAccountNumber,bankName'
                }
            }
        },
        'with-pagination': {
            config: {
                experiences,
                'widget-financial-history': {
                    numberOfRecordsPerPage: 10
                }
            }
        }
    }
});
