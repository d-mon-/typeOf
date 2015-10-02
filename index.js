/**
 * Created by GUERIN Olivier, on 11/09/2015.
 * Twitter: @MisterRaton
 */
;
(function (factory) {
        var path = 'typeof--';
        if (typeof exports !== 'undefined') {
            var typeOf = require(path);
            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = factory(typeOf);
            }
            exports.typeOf = factory(typeOf);
        }
        if (typeof define === 'function' && define.amd) {
            define([path], factory);
        }
    }(function (typeOf) {
        "use strict";
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

            function getFunctionName(_function){
                if(_function.name !== undefined){
                    return _function.name
                }else{
                    var __function = _function.toString(), index = __function.indexOf('(',9);
                    return __function.slice(9,index);
                }
            }

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
                        if (arg === '') {
                            return VALUE_TYPE === 'String';
                        }
                        if(arg === 'Object'){
                            return value instanceof Object;
                        }
                        if(arg ==='Error'){
                            return value instanceof Error;
                        }
                        return VALUE_TYPE === arg;
                    case 'Function':
                        if(IS_OBJECT===true){
                            return value instanceof arg;
                        }
                        return _in(getFunctionName(arg))||_in('Function')
                    case 'RegExp':
                        return arg.test(VALUE_TYPE);
                    case 'Array':
                        if (arg.length === 0) {
                            return _in('Array');
                        }
                        for (var i = 0, l = arg.length; i < l; i++) {
                            if (_in(arg[i]) === true) return true;
                        }
                        return false;
                    case VALUE_TYPE:
                        if (IS_OBJECT === true && typeof arg === 'object' && arg !== null) {
                            //instance against instance
                            if (typeof arg.constructor === 'function') {
                                return value instanceof arg.constructor
                            } else if (typeof value.constructor === 'function') {
                                return arg instanceof value.constructor;
                            }
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

        return function factory() {
            function __in(args) {
                return (args.length === 2) ? TypeOfBuilder(args[0], args[1]) : TypeOfBuilder(args[0], Array.prototype.slice.call(args, 1));
            }

            if (arguments.length === 1) {
                return new TypeOfBuilder(arguments[0]);
            }
            if (arguments.length === 0) {
                return {
                    'getType': function getType(value) {
                        return typeOf(value);
                    },
                    'in': function () {
                        return __in(arguments)
                    }
                };
            }
            return __in(arguments);
        };
    })
);
