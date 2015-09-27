/**
 * Created by GUERIN Olivier, on 11/09/2015.
 * Twitter: @MisterRaton
 */
"use strict";
const typeOf = require('./typeof');
const getConstructorName = require('./getConstructorName');

function TypeOfBuilder(value) {
    /**
     * is an Object ?
     * @type {boolean}
     * @private
     */
    const IS_OBJECT = typeof value === "object";
    /**
     * store type of value
     * @private
     * @type {String}
     */
    const VALUE_TYPE = typeOf(value);


    /**
     * check if type is equal/in value
     * @param {*} arg
     * @returns {Boolean}
     * @private
     */
    function _in(arg) {
        let arg_type = typeOf(arg);
        switch (arg_type) {
            case 'String':
                if (arg === '') {
                    return VALUE_TYPE === 'String';
                } else {
                    return (arg === 'Object' && VALUE_TYPE !== 'Array') ? IS_OBJECT : VALUE_TYPE === arg;
                }
            case 'Function':
                return (IS_OBJECT === true) ? value instanceof arg : _in(getConstructorName(arg.prototype));
            case 'RegExp':
                return arg.test(VALUE_TYPE);
            case 'Array':
                if (arg.length === 0) {
                    return _in('Array');
                }
                for (let v of arg) {
                    if (_in(v) === true) return true;
                }
                return false;
            case VALUE_TYPE:
                if (IS_OBJECT === true && arg !== null) {
                    return Object.getPrototypeOf(value) === Object.getPrototypeOf(arg);
                }
            default:
                return _in(arg_type);
        }
    }

    /**
     * in case we don't want to create an Object. (can't access this.in & this.getType)
     */
    if (arguments.length === 2) {
        return _in(arguments[1]);
    } else {
        /**
         * call _in function to check if type is among arguments
         * @public
         * @returns {Boolean}
         */
        this.in = function () {
            return (arguments.length === 1) ? _in(arguments[0]) : _in(Array.prototype.slice.call(arguments));
        };
        /**
         * return type
         * @returns {String}
         */
        this.getType = function () {
            return VALUE_TYPE;
        };
    }

}

module.exports = function factory(value) {
    if (arguments.length === 1) {
        return new TypeOfBuilder(value);
    } else {
        return (arguments.length === 2) ? TypeOfBuilder(value, arguments[1]) : TypeOfBuilder(value, Array.prototype.slice.call(arguments, 1));
    }
};

