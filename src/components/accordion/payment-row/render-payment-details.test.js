import {assert, expect} from 'chai';
import {shallow} from 'enzyme';

import {renderPaymentDetails} from './render-payment-details';

describe('Payment - render details', () => {
    it('should render alternate row colors', () => {
        const t = () => {};
        const isOpen = true;
        const id = '1234';
        const rowIndex = 1;
        const paymentDetail = {};
        const tableRow = renderPaymentDetails(t, isOpen, id, paymentDetail, rowIndex);

        assert.match(
            tableRow.props.className,
            /payment-row--odd$/,
            'has corresponding CSS class set to display odd row color'
        );
    });

    it('should use tendertype as fallback', () => {
        const t = (keys) => {
            if (keys[1] === 'Checking - Auto Pay - CSS') {
                return keys[1];
            }

            return 'Fallback is not used';
        };
        const isOpen = true;
        const id = '1234';
        const rowIndex = 1;
        const paymentDetail = {
            tenderDetails: [{
                tenderType: 'APSV',
                tenderTypeDescription: 'Checking - Auto Pay - CSS',
                paymentType: null,
                paymentTypeDescription: 'Saving',
                tenderAmount: 33.3,
                cardType: null,
                cardTypeDescription: null,
                last4DigitsOfCardNumber: null,
                last4DigitsOfAccountNumber: '2142',
                last4DigitsOfRoutingNumber: null,
                bankName: null
            }]
        };

        const component = shallow(renderPaymentDetails(t, isOpen, id, paymentDetail, rowIndex));
        const paymentDescription = component.find('.details-row__value').first().text();

        expect(paymentDescription).to.equal('Checking - Auto Pay - CSS');
    });

    it('should render alternate row colors', () => {
        const t = () => {};
        const isOpen = true;
        const id = '1234';
        const rowIndex = 2;
        const paymentDetail = {};
        const tableRow = renderPaymentDetails(t, isOpen, id, paymentDetail, rowIndex);

        assert.match(
            tableRow.props.className,
            /payment-row--even$/,
            'has corresponding CSS class set to display even row color'
        );
    });
});
