import filter from 'lodash/fp/filter';

const blackListedFilters = [
    'C1AD' // adjustment
];

export const removeUnwantedFilters = filter((value) => {
    return blackListedFilters.indexOf(value.filterType) < 0;
});
