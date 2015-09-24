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
    const _isObj = typeof value === "object";
    /**
     * store type of value
     * @private
     * @type {String}
     */
    const type = typeOf(value);


    /**
     * check if type is equal/in value
     * @param {*} arg
     * @returns {Boolean}
     * @private
     */
    function _in(arg) {
        let _type = typeOf(arg);
        switch (_type) {
            case 'String':
                if (arg) {
                    return (arg === 'Object') ? _isObj : type === arg
                }
                return type === 'String';
            case 'Function':
                return (_isObj) ? value instanceof arg : _in(getConstructorName(arg.prototype));
            case 'RegExp':
                return arg.test(type);
            case 'Array':
                if (arg.length) {
                    for (let v of arg) {
                        if (_in(v)) return true
                    }
                } else {
                    return _in('Array');
                }
                return false;
            case type:
                if (_isObj && arg !== null) {
                    return Object.getPrototypeOf(value) === Object.getPrototypeOf(arg);
                }
            default:
                return _in(_type);
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
            return type;
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

