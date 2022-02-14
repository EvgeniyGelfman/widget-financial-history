import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';
import noop from 'lodash/fp/noop';

import {Accordion} from '.';

describe('Accordion', () => {
    it('renders correct accordion state from component when isOpen is true', () => {
        const isOpen = true;
        const accordion = mount(
            <Accordion entityId="P-123" label="Bill" isOpen={isOpen} toggleAccordion={noop} />
        );

        assert.isTrue(
            accordion.find('.disclosable').hasClass('open'),
            'renders correct accordion state for open'
        );
    });

    it('renders correct accordion state from component when isOpen is false', () => {
        const isOpen = false;
        const accordion = mount(
            <Accordion entityId="P-123" label="Bill" isOpen={isOpen} toggleAccordion={noop} />
        );

        assert.isFalse(
            accordion.find('.disclosable').hasClass('open'),
            'renders correct accordion state for closed'
        );
    });
});
