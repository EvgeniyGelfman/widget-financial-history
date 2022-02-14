import get from 'lodash/fp/get';
import curry from 'lodash/fp/curry';

export const queryPaginator = curry((paginatorIdOrPath, state) =>
    get(['paginators', ...[].concat(paginatorIdOrPath)], state), 2);
