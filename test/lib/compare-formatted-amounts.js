/**
 *
 * IE11 intl.NumberFormat displays negative numbers in brackets
 * f.e. opFormatCurrency('EUR', 2, -123456.78)  in Chrome displayed as -€123,456.78,
 * and in IE11 it is displayed as (€123,456.78)
 * This function is workaround against removed intljs polyfill at WPT-6762
 * @param {string} text - Text to test
 * @param {string} amount - Expected amount (without currency symbol and negative sign)
 * @example
 *  t.true(
 *      compareFormattedAmounts(await totalAmounts[0].getText(), '1.56'),
 *      'renders correct payment amount - expected "-$1.56" for webkit and "($1.56)" for IE'
 *  );
 * @see https://github.com/formatjs/react-intl/issues/568
 * @see https://opower.slack.com/archives/C6BFHDP7X/p1568731069017000
 * @return {boolean}
 **/
const compareFormattedAmounts = (text, amount) => {
    return text === `-$${amount}` || text === `($${amount})`;
};

module.exports = {compareFormattedAmounts};
