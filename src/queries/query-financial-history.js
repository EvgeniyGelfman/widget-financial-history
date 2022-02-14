import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import values from 'lodash/fp/values';

export const queryFinancialHistory = compose(values, get(['financialHistory']));
