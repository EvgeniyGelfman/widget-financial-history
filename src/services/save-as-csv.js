import {json2csv} from './json2csv';

import {saveAs} from 'filesaver.js';
import Blob from 'blob';

/**
 * @param {string} filename
 * @param {array} headers
 * @param {function(string):string} translateHeaders Translate header function.
 * @param {function(value:any, context:object, path:string):string} translateValues Translate values function.
 * @return {function(Array<PayEvent>): Promise<void>}
 */
export const saveAsCsv = ({
    filename,
    headers,
    translateHeaders = (header) => header,
    // eslint-disable-next-line no-unused-vars
    translateValues = (value, context, path) => String(value)
}) => {
    const makeCsv = json2csv({headers, translateHeaders, converter: translateValues});

    return async (data) => makeCsv(data)
        .then(csv => new Blob([csv], {type: 'text/csv;charset=utf-8'}))
        .then(csv => saveAs(csv, filename, {autoBom: true}));
};
