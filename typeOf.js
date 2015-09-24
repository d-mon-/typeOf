/**
 * Created by GUERIN Olivier, on 11/09/2015.
 * Twitter: @MisterRaton
 */
const getConstructorName = require('./getConstructorName');

/**
 * return the type/class-name of the value
 * return "Boolean"|"String"|"Function"|"Number"|"NaN"|"Null"|"Undefined"|"Error"|"TypeError"|"GeneratorFunction'|"Iterator"|"HTMLDocument"|"Symbol"|"RegExp" and more...
 * @param {*} value
 * @returns {String}
 */
module.exports = function typeOf(value) {
    if (typeof value === "number" && isNaN(value)) return "NaN";
    if (value === null) return 'Null';
    if (value === undefined) return 'Undefined';
    return getConstructorName(value);
};