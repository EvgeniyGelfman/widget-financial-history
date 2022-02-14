import getOr from 'lodash/fp/getOr';

export const queryLookupTransaction = (state) => {
    const currentTransactionFilter = getOr('', 'transactionFilter')(state);

    return currentTransactionFilter;
};
