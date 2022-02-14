import get from 'lodash/fp/get';
import isEmpty from 'lodash/fp/isEmpty';
import {queryPaginator} from './query-paginator';

const getPaginatorId = get(['dateFilter']);
const getPaginatorIdTransaction = get(['transactionFilter']);

export const querySelectedPaginator = (state) =>{
    const paginatorIdTransaction = getPaginatorIdTransaction(state);
    const paginatorId = getPaginatorId(state);

    return queryPaginator(
        !isEmpty(paginatorIdTransaction) ?
            `${paginatorId}#${paginatorIdTransaction}`
            : paginatorId
    )(state);
};

export const querySelectedPaginatorTransaction = (state) =>
    queryPaginator(getPaginatorIdTransaction(state))(state);
