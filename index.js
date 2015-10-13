/**
 * Created by GUERIN Olivier, on 11/09/2015.
 * Twitter: @MisterRaton
 */
;
(function (factory) {
        var path = 'typeof--';
        if (typeof exports !== 'undefined') {
            var typeOf = require(path);
            var getFunctionName = require(path + '/getFunctionName');
            var getConstructor = require(path + '/getConstructor');

            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = factory(typeOf, getFunctionName, getConstructor);
            }
            exports.typeOf = factory(typeOf, getFunctionName, getConstructor);
        }
        if (typeof define === 'function' && define.amd) {
            define([path + '/index', path + '/getFunctionName', path + '/getConstructor'], factory);
        }
    }(function (typeOf, getFunctionName, getConstructor, undefined) {
        "use strict";
        var arraySlice = Array.prototype.slice;

        function TypeOfBuilder(value) {
            /**
             * store if value is an Object
             * @Constant
             * @type {boolean}
             * @private
             */
            var IS_OBJECT = typeof value === "object";
            /**
             * store type of value
             * @Constant
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
                    case '#Null':
                    case '#Undefined':
                    case '#NaN':
                        return VALUE_TYPE === arg_type;
                    case 'String':
                        return VALUE_TYPE === arg;
                    case 'Function':
                        return (IS_OBJECT === true) ? value instanceof arg : VALUE_TYPE === getFunctionName(arg);
                    case 'RegExp':
                        return arg.test(VALUE_TYPE);
                    case 'Array':
                        if (arg.length === 0){
                            return  VALUE_TYPE === 'Array';
                        }
                        for (var i = 0, l = arg.length; i < l; i++) {
                            if (_in(arg[i]) === true) {
                                return true;
                            }
                        }
                        return false;
                    case VALUE_TYPE:
                        if (IS_OBJECT === true || typeof arg === 'object') {
                            if (valueConstructor === undefined) {
                                valueConstructor = getConstructor(value);
                            }
                            if (valueConstructor !== null && arg instanceof valueConstructor) {
                                return true;
                            }
                            var argConstructor = getConstructor(arg);
                            return (argConstructor !== null) ? value instanceof argConstructor : false;
                        }
                    default:
                        return VALUE_TYPE === arg_type;
                }
            }

            //in case we don't want to create an Object. (it does not expose this.In & this.getType)
            if (arguments.length === 2) {
                return _in(arguments[1]);
            } else {
                /**
                 * call _in function to check if type is among arguments
                 * @public
                 * @returns {Boolean}
                 */
                this.In = function () { //this.in is not supported by IE6
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
