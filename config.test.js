import ava from 'ava';

import joi from '@opower/config-schema';

import configSchema from './config';

ava('Config generates a valid schema', t => {
    t.deepEqual(
        joi.attempt(joi.attempt({}, configSchema), configSchema),
        {
            numberOfViewableBillYears: 5,
            targetExperiences: {
                accountOverview: 'accountOverview',
                viewBill: 'billingAndPaymentOverview',
                cancelScheduledPayment: 'cancelScheduledPayment',
                billHistory: 'billHistory'
            },
            formatConfig: {
                numberOfDecimalPlaces: 2
            },
            numberOfRecordsPerPage: 15,
            enableDownload: true,
            csvFields: 'date,label,amount,currency,currencyCode,billId,paymentId'
        }
    );
});
