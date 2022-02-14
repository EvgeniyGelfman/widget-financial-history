import isNil from 'lodash/fp/isNil';
import isEmpty from 'lodash/fp/isEmpty';
import map from 'lodash/fp/map';
import trim from 'lodash/fp/trim';
import isArray from 'lodash/fp/isArray';
import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import size from 'lodash/fp/size';
import get from 'lodash/fp/get';
import identity from 'lodash/fp/identity';
import {CSV_HEADERS} from '../constants';

const flattenCsvFields = (fields, data) => {
    const context = [];

    const simpleFields = filter(header => !CSV_HEADERS[header].isArray)(fields);
    const arrayFields = filter(header => CSV_HEADERS[header].isArray)(fields);

    let maxArrayLength = 1;

    /**
     * CSV format is not suitable to express fields that are arrays and/or when there are several array fields
     * where element at each index associated with element in other array with the same index.
     *
     * E.g. given array-like fields [Bank1, Bank2], [card1, card2], [amount1, amount2] we need express
     * this information in csv format so that it was clear and easy to understand relation
     * [Bank1 - card1 - amount1](tenant 1) and [Bank2 - card2 - amount2](tenant 2).
     *
     * The idea is to duplicate columns for array fields in csv file and stack them one after another. For example
     * for above mentioned arrays csv row will be:
     *
     * @example
     * |Bank1 | card1 | amount1 | Bank2 | card2 | amount2|
     *
     * This idea requires us to know to calculate number of columns in advance. To calculate number of columns
     * we need to know size of the largest array on any row.
     */
    data.forEach(record => {
        arrayFields.forEach(arrayField => {
            const arr = getCSVValue(CSV_HEADERS[arrayField].path, record, String);

            maxArrayLength = Math.max(maxArrayLength, size(arr));
        });
    });

    /**
     * First gather information needed to fill information for fields of a simple type.
     */
    simpleFields.forEach(field => {
        const {path} = CSV_HEADERS[field];

        context.push({
            field,
            path,
            selector: identity
        });
    });

    /**
     * Then deal with array fields. For each field we will create as many columns as is the maximum array size
     * we have found so far.
     */
    for (let i = 0; i < maxArrayLength; i += 1) {
        arrayFields.forEach(field => {
            const {path} = CSV_HEADERS[field];
            const index = i;
            const selectByIndex = (arr) => arr.length > index ? arr[index] : '';

            context.push({
                field,
                path,
                selector: selectByIndex
            });
        });
    }

    return context;
};

export const evaluatePath = (path, record) => {
    path = typeof path === 'string' ? path.split('.') : path;

    if ( isEmpty(path) || !record ) {
        return record;
    }
    const [part, ...remains] = path;
    const slice = record[part];

    if (isArray(slice)) {
        return map((doc) => evaluatePath(remains, doc), slice);
    }

    return evaluatePath(remains, slice);
};

const convertUndefined = (value) => isNil(value) ? '' : value;
const convertArrays = value => isArray(value) ? map(convertUndefined)(value) : value;
const preprocessCSVValue  = compose(convertArrays, convertUndefined);
/*
-  If a value contains a comma, a newline character or a double quote,
     then the string must be enclosed in double quotes.
     E.g: "Newline char in this field \n"
-  A double quote must be escaped with another double quote.
     E.g: "The double quote character "" is offensive.
*/
const escapeAndQuoteCSVValue = value => {
    let quote = /[,\r\n"]/.test(value) ? '"' : '';
    let escapedValue = value.replace(/"/g, '""');

    return `${quote}${escapedValue}${quote}`;
};

const getCSVValue = (path, record, converter) => {
    let value = evaluatePath(path, record);

    const convert = compose(
        escapeAndQuoteCSVValue,
        trim,
        (val) => converter(val, record, path)
    );

    value = preprocessCSVValue(value);

    return isArray(value) ? map(convert)(value) : convert(value);
};

const FIELDS_SEPARATOR = ',';
const LINES_SEPARATOR = '\r\n';

/**
 * Convert array of objects to CSV format.
 * @param {Array<string>} headers keys of CSV_HEADER object that represent fields to be included in CSV that
 * @param {function(fieldId:string):string = String} translateHeaders function accepts string-key of CSV_HEADER and
 * used to generate caption for each column in csv.
 * @param {function(value:any, context:object, path:string):string = String} converter Optional function to convert
 *   values. Converter function must return string and will be called with 3 arguments:
 *    - value to be converted
 *    - record row - object/row which is being processed
 *    - path - object path (header)
 * @return {function(*=): Promise<String>}
 */
export const json2csv = ({headers = [], translateHeaders, converter = String} = {}) => async (data) => {
    const csvFields = flattenCsvFields(headers, data);

    const headerLine = compose(map(escapeAndQuoteCSVValue), map(translateHeaders), map(get('field')))(csvFields);

    const csvContent = data.map(entity => {
        return csvFields.map(({path, selector: select}) => {
            const value = getCSVValue(path, entity, converter);

            return select(value);
        });
    });

    return [headerLine, ...csvContent]
        .map(line => line.join(FIELDS_SEPARATOR))
        .join(LINES_SEPARATOR);
};
