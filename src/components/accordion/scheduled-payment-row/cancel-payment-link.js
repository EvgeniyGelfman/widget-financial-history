import React from 'react';
import PropTypes from 'prop-types';

import {ExperienceLink} from '@opower/maestro-react/experiences';
import {RequirePermissions} from '@opower/dss-permissions-components/react';

import {PERMISSIONS} from '../../constants';
import {ScheduledPaymentShape} from './scheduled-payment.shape';

export const CancelPaymentLink = ({scheduledPayment, t}) => (
    <RequirePermissions permissions={PERMISSIONS.PAYMENT_MANAGE}>
        <ExperienceLink
            targetConfigKey="cancelScheduledPayment"
            query={{paymentId: scheduledPayment.paymentId}}
            variables={scheduledPayment}
            className="cancel-payment-link"
        >
            {t('CANCEL_PAYMENT')}
        </ExperienceLink>
    </RequirePermissions>
);

CancelPaymentLink.propTypes = {
    scheduledPayment: ScheduledPaymentShape.isRequired,
    t: PropTypes.func.isRequired
};
