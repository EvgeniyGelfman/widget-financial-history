import {store} from '@opower/widget-store';
import '@opower/account-namespace';

import {registerReducer} from './namespace';
import {rootReducer} from './reducers';

export {store};

export const install = (store) => {
    registerReducer(rootReducer, store);
};

install(store);
