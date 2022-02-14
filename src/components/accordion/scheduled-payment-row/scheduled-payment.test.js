import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';

import noop from 'lodash/fp/noop';

import {mockTranslate} from '../../../test/lib/mock-translate';
import {ScheduledPaymentBody} from './scheduled-payment-body';
import {ScheduledPaymentHeader} from './scheduled-payment-header';
import {ScheduledPaymentView} from './scheduled-payment-view';

const formatAmount = (t, amount) =>  '-$' + Number(amount).toFixed(2);

const setup = (scheduledPayment) => ({
    header: shallow(
        <ScheduledPaymentHeader
            t={mockTranslate}
            scheduledPayment={scheduledPayment}
            formatAmount={formatAmount}
            isOpen={false}
            toggleAccordion={noop}
        />),
    body: shallow(
        <ScheduledPaymentBody
            scheduledPayment={scheduledPayment}
            t={mockTranslate}
            isOpen
            formatAmount={formatAmount}
        />)
});

describe('ScheduledPaymentView', () => {
    it ('do not render anything if scheduledPayment prop null, undefined, empty, etc', () => {
        const objects = [null, void 0, '', 0, false, {}, []];

        const components = objects.map( scheduledPayment => shallow(
            <ScheduledPaymentView
                toggleAccordion={noop}
                scheduledPayment={scheduledPayment}
                t={noop}
                isOpen
                formatAmount={noop}
            />
        ));
        const test = (component) => {
            assert.notExists(
                component.find('ScheduledPaymentBody'),
                'it should not render body if scheduledPayment empty'
            );

            assert.notExists(
                component.find('ScheduledPaymentHeader'),
                'it should not render header if scheduledPayment empty'
            );
        };

        for ( let component of components ) {
            test(component);
        }
    });

    it('renders scheduled payment', () => {
        const scheduledPayment = {
            id: '0',
            paymentId: '0',
            scheduledDate: '2017-04-26',
            totalAmount: 120,
            status: 'PENDING',
            description: 'Payment Method'
        };

        const {header} = setup(scheduledPayment);

        const label = header.find('Accordion').prop('label');

        assert.strictEqual(
            header.find('.activity-date').text(),
            'Apr 26, 2017',
            'renders correct date for record'
        );

        assert.strictEqual(
            label,
            'Scheduled payment',
            'renders correct activity description'
        );

        assert.strictEqual(
            header.find('.activity-amount').text(),
            '-$120.00',
            'renders scheduled payment\'s amount as negative number'
        );

        assert.isTrue(
            header.find('.activity').hasClass('activity--processing'),
            'renders with a special formatting'
        );
    });

    it('renders scheduled multi-payment', () => {
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

        const {header, body} = setup(scheduledPayment);
        const label = header.find('Accordion').prop('label');

        assert.strictEqual(
            header.find('.activity-date').text(),
            'Apr 26, 2017',
            'renders correct date for record'
        );

        assert.strictEqual(
            label,
            'Scheduled payment',
            'renders correct activity description'
        );

        assert.strictEqual(
            header.find('.activity-amount').text(),
            '-$120.00',
            'renders scheduled payment\'s amount as negative number'
        );

        assert.strictEqual(
            body.find('.details-row--summary').prop('value'),
            '-$120.00',
            'renders multipayment info (with scheduledPayment prop)'
        );

        assert.exists(
            body.find('.details-link-row'),  // there must be a details row with ExperienceLink as label
            'renders a  cancel-payment link'
        );
    });
});
