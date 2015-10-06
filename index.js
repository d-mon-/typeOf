/**
 * Created by GUERIN Olivier, on 11/09/2015.
 * Twitter: @MisterRaton
 */
;
(function (factory) {
        var path = 'typeof--';
        if (typeof exports !== 'undefined') {
            var typeOf = require(path);
            var extractFunctionName = require(path + '/extractFunctionName');
            var getOwnConstructor = require(path + '/getOwnConstructor');

            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = factory(typeOf, extractFunctionName, getOwnConstructor);
            }
            exports.typeOf = factory(typeOf, extractFunctionName, getOwnConstructor);
        }
        if (typeof define === 'function' && define.amd) {
            define([path + '/index', path + '/extractFunctionName', path + '/getOwnConstructor'], factory);
        }
    }(function (typeOf, extractFunctionName, getOwnConstructor) {
        "use strict";
        var arraySlice = Array.prototype.slice;

        function TypeOfBuilder(value) {
            /**
             * is an Object ?
             * @type {boolean}
             * @private
             */
            var IS_OBJECT = typeof value === "object";
            /**
             * store type of value
             * @private
             * @type {String}
             */
            var VALUE_TYPE = typeOf(value);
            /**
             * store constructor of value
             * @private
             * @type {String}
             */
            var valueConstructor;


            /**
             * check if type is equal/in value
             * @param {*} arg
             * @returns {Boolean}
             * @private
             */
            function _in(arg) {
                var arg_type = typeOf(arg);
                switch (arg_type) {
                    case 'String':
                        return VALUE_TYPE === arg;
                    case 'Function':
                        return (IS_OBJECT === true) ? value instanceof arg : _in(extractFunctionName(arg));
                    case 'RegExp':
                        return arg.test(VALUE_TYPE);
                    case 'Array':
                        for (var i = 0, l = arg.length; i < l; i++) {
                            if (_in(arg[i]) === true) return true;
                        }
                        return (arg.length === 0) ? _in('Array') : false;
                    case VALUE_TYPE:
                        if ((IS_OBJECT === true && value !== null) || (typeof arg === 'object' && arg !== null)) {
                            if (typeof valueConstructor === 'undefined') {
                                valueConstructor = (value !== null) ? getOwnConstructor(value) : null;
                            }
                            if (valueConstructor !== null) {
                                return arg instanceof valueConstructor;
                            } else if (arg !== null) {
                                var argConstructor = (value !== null) ? getOwnConstructor(arg) : null;
                                if (argConstructor !== null) {
                                    return value instanceof argConstructor
                                }
                            }
                            return false;
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
                this.In = function () {
                    return (arguments.length === 1) ? _in(arguments[0]) : _in(arraySlice.call(arguments));
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

        return function factory() {
            function __in(args) {
                return (args.length === 2) ? TypeOfBuilder(args[0], args[1]) : TypeOfBuilder(args[0], arraySlice.call(args, 1));
            }

            if (arguments.length === 1) {
                return new TypeOfBuilder(arguments[0]);
            }
            if (arguments.length === 0) {
                return {
                    'getType': function getType(value) {
                        return typeOf(value);
                    },
                    'In': function () {
                        return __in(arguments)
                    }
                };
            }
            return __in(arguments);
        };
    })
);
