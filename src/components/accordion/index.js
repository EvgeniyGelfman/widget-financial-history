import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export const Accordion = ({label, isOpen: open, toggleAccordion, entityId}) => {
    return (
        <span
            tabIndex="0"
            aria-controls={`details-${entityId}`}
            aria-expanded={open}
            role="button"
            onClick={() => toggleAccordion({entityId})}
            onKeyPress={(event) => {
                if (event.which === 13) {
                    event.preventDefault();
                    toggleAccordion({entityId});
                }
            }}
        >
            <span className={classnames('disclosable', {open})}>
                {/*TODO: when service changes are finalized, check if we should use message props*/}
                {label}
            </span>
        </span>
    );
};

Accordion.propTypes = {
    entityId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleAccordion: PropTypes.func.isRequired
};
