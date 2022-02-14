import isEmpty from 'lodash/fp/isEmpty';
import {Validator} from 'jsonschema';

const validator = new Validator();

validator.addSchema(require('./bill'));
validator.addSchema(require('./payment'));

const schemaValidate = (response, schema) => {
    if (response.statusCode < 200 || response.statusCode > 299) {
        return true; //error response is always valid :-)
    }

    let validationResult = validator.validate(response.body, schema);
    const isValid = isEmpty(validationResult.errors);

    if (!isValid) {
        //eslint-disable-next-line no-console
        console.error('schema validation errors: ', validationResult.errors);
        return validationResult;
    }

    return isValid;
};

export const validateFinancialHistoryResponse = (response) => {
    return schemaValidate(response, require('./history'));
};

export const validateFinancialHistoryDownloadResponse = (response) => {
    return schemaValidate(response, require('./download'));
};
