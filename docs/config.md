
# widget-financial-history configuration

## targetExperiences

### targetExperiences.accountOverview

This is an experience to link to the Account Overview page

|Default|Type|Valid values|
|------|------|------|
|`accountOverview`|string|``|

### targetExperiences.viewBill

This is an experience to link to the Billing and Payment Overview
and should be configured in the theme.

|Default|Type|Valid values|
|------|------|------|
|`billingAndPaymentOverview`|string|``|

### targetExperiences.billHistory

This is an experience to link to the Billing and Payment History Widget
and should be configured in the theme.

|Default|Type|Valid values|
|------|------|------|
|`billHistory`|string|``|

### targetExperiences.cancelScheduledPayment

This is an experience to link to navigate to 'Cancel a Scheduled Payment'
page and should be configured in the theme.

|Default|Type|Valid values|
|------|------|------|
|`cancelScheduledPayment`|string|``|

## numberOfViewableBillYears

Number of years that a user can view the bills up to staring from today

|Default|Integer|Min|Positive|Type|
|------|------|------|------|------|
|`5`||0||number|

## csvFields

Configures list of cvs fields separated with comma that should appear in downloaded cvs file.

Known values are (but not limited to): date, label, amount, currency, currencyCode, billId,
paymentId, bankName, last4DigitsOfAccountNumber

By default cvs file will contain all available fields. The clients that want to hide some should 
specify explicitly what fields they want to be in cvs

E.g: date,label,amount,payDetail.paymentId

|Default|Type|Valid values|
|------|------|------|
|`date,label,amount,currency,currencyCode,billId,paymentId`|string|``|

## formatConfig

### formatConfig.numberOfDecimalPlaces

Number of decimal places for the bill/payment amount

|Default|Integer|Min|Positive|Type|
|------|------|------|------|------|
|`2`||0||number|

## numberOfRecordsPerPage

Number of records that a user can view in a pagination page

|Default|Integer|Min|Positive|Type|
|------|------|------|------|------|
|`15`||1||number|

## enableDownload

Allow to disable "Download CSV" functionality by setting this flag to false. Enabled by default

|Default|Type|
|------|------|
|`true`|boolean|
