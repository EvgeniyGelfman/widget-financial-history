import getOr from 'lodash/fp/getOr';

export const queryAccordionStateById = (entityId) => getOr(false, ['accordion', entityId]);
