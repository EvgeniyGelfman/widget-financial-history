# widget-financial-history [![Build Status][jenkins-image]][jenkins-url]

### Overview
The widget shows all the financial transactions that have been made on an account. Those include scheduled payments,
pending payments, processed payments, posted bills and declined payments.
Users can also filter payments by period i. e. view all transactions all only those that go back a certain number of years,
or view only scheduled payments excluding those payments that have been process etc. The widget also allows users to
download their bills.

### API Calls
The widget makes the following API calls:


| Path | Description  |
|---|---|
| bill-trends-v1/cws/v2/utilities/{{clientCode}}/financialHistory  | returns financial history of an account  |
| bill-trends-v1/cws/v2/utilities/{{clientCode}}/financialHistory/download  | download financial history  |

### Configuration

| config value  | type  | description  |
|---|---|---|
| numberOfViewableBillYears  | integer  | Number of years that a user can view the bills up to staring from today  |
| csvFields  | string   | Configures list of cvs fields separated with comma that should appear in downloaded cvs file.  |
| formatConfig  | integer  | Number of decimal places for the bill/payment amount  |
| numberOfRecordsPerPage  | integer  | Number of records that a user can view in a pagination page  |
| enableDownload  | boolean  | Enable/disable the download button |

### Target experiences

| config value  | type  |
|---|---|
| accountOverview  | Link to the Account Overview page  |
| viewBill  | Link to the Billing and Payment Overview and should be configured in the theme  |
| billHistory  | Link to billing and payment history page and should be configured in the theme  |
| cancelScheduledPayment  | Link to navigate to 'Cancel a Scheduled Payment' page and should be configured in the theme  |

## Running the widget
To run the widget, first run `npm install` to install dependencies.

Then just run `npm start`.

## Running the tests
To run the tests, first install `x-web-get-client-theme` globally: `npm install -g x-web-get-client-theme`.

Then run `npm test`.

## Code Review Checklist
Refer to this [code review checklist](https://wiki.opower.com/display/PD/Reducers+Widget+Code+Review+Checklist) before pushing any code changes.

## Configuration Options
The widget configurations live in `config.js`. You can read more about each configuration property in the [configuration docs](./docs/config.md).


## Welcome to NextWeb
This is a [NextWeb](https://wiki.opower.com/display/PD/nextweb) widget. 

This widget uses [React](https://reactjs.org/) for component based development.
See the [NextWeb Gitbook](https://github.va.opower.it/pages/documentation/nextweb/cli-commands/) to
learn about command line options.

Other relevant docs pages:

To develop this widget, use the [NextWeb Developer Setup](https://github.va.opower.it/pages/documentation/nextweb/developer-setup/index.html).

[jenkins-image]: https://opower-jenkins.iad.opower.it/buildStatus/icon?job=digital-self-service/widget-financial-history/master
[jenkins-url]: https://opower-jenkins.iad.opower.it/job/digital-self-service/job/widget-financial-history/job/master/
