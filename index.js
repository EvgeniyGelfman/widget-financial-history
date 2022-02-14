import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import {MaestroProvider} from '@opower/maestro-react';

import {App} from './src/components/app';

export const bootstrap = ({el}) => {
    render(
        <MaestroProvider el={el}>
            <App />
        </MaestroProvider>,
        el
    );

    return {
        destroy: () => unmountComponentAtNode(el)
    };
};
