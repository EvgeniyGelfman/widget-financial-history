import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {assert} from 'chai';
import {mount, shallow} from 'enzyme';

import {MockConfigProvider} from '@opower/maestro-react/mock';
import {name as accountNamespace} from '@opower/account-namespace';

import {mockTranslate} from '../../../test/lib/mock-translate';
import {PERMISSIONS} from '../../constants';
import {ScheduledPaymentBody} from './scheduled-payment-body';

const formatAmount = (t, amount) =>  '-$' + Number(amount).toFixed(2);

const createMockStore = configureMockStore();

const setup = (scheduledPayment) => {
    return shallow(
        <ScheduledPaymentBody
            t={mockTranslate}
            scheduledPayment={scheduledPayment}
            formatAmount={formatAmount}
            rowIndex={0}
            isOpen
        />
    );
};

describe('ScheduledPayment#paymentBreakDown', () => {
    it('Do not render payment breakdown for single-account payment', () => {
        const scheduledPayment = {
            id: '0',
            paymentId: '0',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'PENDING'
        };
        const component = setup(scheduledPayment);
        const rows = component.find('DetailsRow:not(.details-link-row)'); // but cancel payment link should present

        assert.notExists(
            rows,
            'Should not render payment breakdown for single payment'
        );
    });

    it('render payment breakdown for multi-account payment', () => {
        const scheduledPayment = {
            accountPayments: [
                {accountId: '111222333', paymentAmount: '50'},
                {accountId: '111222334', paymentAmount: '40'},
                {accountId: '111222335', paymentAmount: '30'}
            ],
            paymentId: '12311125',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'SCHEDULED',
            description: 'Multi Payment fixture'
        };
        const component = setup(scheduledPayment);
        const rows = component.find('DetailsRow');

        assert.deepEqual(
            rows.map(row => row.props()).slice(0, -1), // omit last row (Cancel payment link)
            [
                {
                    className: 'details-row--pad-top',
                    label: 'Account# 111222333',
                    value: '-$50.00'
                },
                {
                    className: '',
                    label: 'Account# 111222334',
                    value: '-$40.00'
                },
                {
                    className: 'details-row--pad-bottom',
                    label: 'Account# 111222335',
                    value: '-$30.00'
                },
                {
                    className: 'details-row--emphasized details-row--summary',
                    label: 'Total scheduled payment',
                    value: '-$120.00'
                }
            ],
            'renders a payment-breakdown with totals row'
        );
    });

    it('render payment breakdown for multi-account payment with 1 account', () => {
        const scheduledPayment = {
            accountPayments: [
                {accountId: '111222333', paymentAmount: '50'}
            ],
            paymentId: '12311125',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'SCHEDULED',
            description: 'Multi Payment fixture'
        };
        const component = setup(scheduledPayment);
        const rows = component.find('DetailsRow');

        assert.deepEqual(
            rows.map(row => row.props()).slice(0, -1), // omit last row (Cancel payment link)
            [
                {
                    className: 'details-row--pad-top details-row--pad-bottom',
                    label: 'Account# 111222333',
                    value: '-$50.00'
                },
                {
                    className: 'details-row--emphasized details-row--summary',
                    label: 'Total scheduled payment',
                    value: '-$120.00'
                }
            ],
            'renders a payment-breakdown with totals row'
        );
    });

});

describe('ScheduledPayment#CancelPaymentLink', () => {
    it('Do not render anything if payment can not be canceled (erred or processed)', () => {
        const scheduledPayment = {
            paymentId: '0',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'ERROR',
            description: 'Expired Payment Method'
        };
        const component = setup(scheduledPayment);

        assert.notExists(
            component.find('DetailsRow'),
            'Should not render cancel-payment link for non-cancellable payment'
        );
    });

    it('Does render cancel payment link if payment can  be canceled (scheduled)', () => {
        const scheduledPayment = {
            paymentId: '0',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'SCHEDULED',
            description: 'Expired Payment Method'
        };
        const component = setup(scheduledPayment);

        assert.exists(
            component.find('DetailsRow').prop('label'),
            'Should render DetailsRow with cancel-payment link for cancellable (scheduled) payment'
        );
    });

    it('renders an experience link to cancel-payment page for payment in SCHEDULED state', () => {
        const scheduledPayments = [{
            paymentId: 'PAYMENT_ID_HERE',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'SCHEDULED',
            description: 'payment method 0 description'
        }, {
            paymentId: 'PAYMENT_ID_HERE',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'PENDING',
            description: 'payment method 1 description'
        }];

        scheduledPayments.forEach(scheduledPayment => {
            const component = setup(scheduledPayment);
            const label = shallow(component.find('DetailsRow').prop('label'));
            // We do not test anything related to permissions here, but testing that:
            // - Corresponding DetailsRow exists & created for cancellable payments
            // - Correct props are passed to experience link.
            const {query, targetConfigKey, variables} = label.find('connectConfig(ExperienceLink)').props();

            assert.deepEqual(
                {query, targetConfigKey, variables},
                {
                    targetConfigKey: 'cancelScheduledPayment',
                    query: {
                        paymentId: 'PAYMENT_ID_HERE'
                    },
                    variables: scheduledPayment
                },
                'Should pass correct props (query params and variables) to ExperienceLink when payment is `cancellable`'
            );
        });
    });

    it('Do not render Cancel link if user does not have corresponding permissions', () => {
        const scheduledPayment = {
            paymentId: 'PAYMENT_ID_HERE',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'SCHEDULED',
            description: 'payment method 0 description'
        };
        const component = setup(scheduledPayment);
        const store = createMockStore({
            [accountNamespace]: {
                selectedAccount: {
                    data: {
                        permissions: ['none/all']
                    }
                }
            }
        });
        const label = mount(
            <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
                <ReduxProvider store={store}>
                    {component.find('DetailsRow').prop('label')}
                </ReduxProvider>
            </MockConfigProvider>
        );

        assert.exists(label.find('CancelPaymentLink'));
        assert.notExists(
            label.find('ExperienceLink'),
            'Should not render cancel-payment link for user without permissions to cancel'
        );
    });

    it('Renders Cancel-Payment link if user has corresponding permissions', () => {
        const scheduledPayment = {
            paymentId: 'PAYMENT_ID_HERE',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'SCHEDULED',
            description: 'payment method 0 description'
        };
        const component = setup(scheduledPayment);
        const store = createMockStore({
            [accountNamespace]: {
                selectedAccount: {
                    data: {
                        permissions: [PERMISSIONS.PAYMENT_MANAGE]
                    }
                }
            }
        });
        const label = mount(
            <MockConfigProvider getExperienceLink={() => ({url: '/xyz', target: '_self'})}>
                <ReduxProvider store={store}>
                    {component.find('DetailsRow').prop('label')}
                </ReduxProvider>
            </MockConfigProvider>
        );

        assert.exists(label.find('CancelPaymentLink'));

        assert.exists(
            label.find('ExperienceLink'),
            'Should render cancel-payment link for user with permissions to cancel'
        );

        assert.deepEqual(
            label.find('ExperienceLink').props().query,
            {paymentId: scheduledPayment.paymentId},
            'paymentId should be passed as query param to CancelPayment experience'
        );
    });

});
