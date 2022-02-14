const joi = require('@opower/config-schema');

const {defineSymphony} = require('@opower/config-schema/symphony');

const s = defineSymphony({
    tabs: {
        general: {
            categories: {
                empty: {
                    order: 0,
                    hideDecoration: true,
                    groups: {
                        empty: {
                            order: 0,
                            hideDecoration: true
                        }
                    }
                }
            },
            order: 10,
            title: 'General'
        },
        links: {
            categories: {
                empty: {
                    order: 0,
                    hideDecoration: true,
                    groups: {
                        empty: {
                            order: 0,
                            hideDecoration: true
                        }
                    }
                }
            },
            order: 20,
            title: 'Links'
        }
    }
});

module.exports = joi.object({
    targetExperiences: joi
        .object({
            accountOverview: joi
                .string()
                .default('accountOverview')
                .description(`This is an experience to link to the Account Overview page`)
                .symphony(
                    s({
                        placements: ['links.empty.empty']
                    })
                ),
            viewBill: joi
                .string()
                .default('billingAndPaymentOverview')
                .description(`
                    This is an experience to link to the Billing and Payment Overview
                    and should be configured in the theme.
                `)
                .symphony(
                    s({
                        placements: ['links.empty.empty']
                    })
                ),
            billHistory: joi
                .string()
                .default('billHistory')
                .description(`
                    This is an experience to link to the Billing and Payment History Widget
                    and should be configured in the theme.
                `)
                .symphony(
                    s({
                        placements: ['links.empty.empty']
                    })
                ),
            cancelScheduledPayment: joi
                .string()
                .default('cancelScheduledPayment')
                .description(`
                    This is an experience to link to navigate to 'Cancel a Scheduled Payment'
                    page and should be configured in the theme.
                `)
                .symphony(
                    s({
                        placements: ['links.empty.empty']
                    })
                )
        }),
    numberOfViewableBillYears: joi
        .number()
        .positive()
        .integer()
        .min(0)
        .default(5)
        .description(`Number of years that a user can view the bills up to staring from today`)
        .symphony(
            s({
                placements: ['general.empty.empty']
            })
        ),
    csvFields: joi
        .string()
        .allow('')
        .default('date,label,amount,currency,currencyCode,billId,paymentId')
        .description(`
        Configures list of cvs fields separated with comma that should appear in downloaded cvs file.
        
        Known values are (but not limited to): date, label, amount, currency, currencyCode, billId,
        paymentId, bankName, last4DigitsOfAccountNumber
        
        By default cvs file will contain all available fields. The clients that want to hide some should 
        specify explicitly what fields they want to be in cvs
        
        E.g: date,label,amount,payDetail.paymentId
        `)
        .symphony(
            s({
                placements: ['general.empty.empty']
            })
        ),
    formatConfig: joi
        .object({
            numberOfDecimalPlaces: joi
                .number()
                .positive()
                .integer()
                .min(0)
                .default(2)
                .description(`Number of decimal places for the bill/payment amount`)
                .symphony(
                    s({
                        placements: ['general.empty.empty']
                    })
                )
        }),
    numberOfRecordsPerPage: joi
        .number()
        .positive()
        .integer()
        .min(1)
        .default(15)
        .description(`Number of records that a user can view in a pagination page`)
        .symphony(
            s({
                placements: ['general.empty.empty']
            })
        ),
    enableDownload: joi
        .boolean()
        .default(true)
        .description('Allow to disable "Download CSV" functionality by setting this flag to false. Enabled by default')
        .symphony(
            s({
                placements: ['general.empty.empty']
            })
        )
});
