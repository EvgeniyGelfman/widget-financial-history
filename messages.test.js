const ava = require('ava');
const {readFile} = require('fs-extra');
const get = require('lodash/fp/get');
const {promisify} = require('util');
const {parse} = require('x-web-properties');

const joi = require('@opower/config-schema');

const messagesSchema = require('./messages.js');
const namespace = require('./package').name;

const parseProperties = async (fileContents) =>
    await promisify(parse)(fileContents, {
        namespaces: true,
        strict: true,
        sections: true
    });

const getWidgetMessages = get(`x-web.${namespace}`);
const messagesFilePath = `./messages/messages.properties`;

ava('messages-schema', async (t) => {
    const messagesFileContents = await readFile(messagesFilePath, {
        encoding: 'utf8'
    });
    const messages = getWidgetMessages(
        await parseProperties(messagesFileContents)
    );
    const {error} = joi.validate(messages, messagesSchema);

    /**
     * If this test failed please update your messages schema; You can do this by running
     * `symphony-schema migrate-messages` or by editing messages.js
     * @see https://github.va.opower.it/pages/documentation/nextweb/message-properties/
     */
    t.falsy(
        error,
        `
        Messages in ${messagesFilePath} should be consistent:
        Detailed error: ${get('message', error)}
        `
    );
});
