/**
 * Created by GUERIN Olivier, on 11/09/2015.
 * Twitter: @MisterRaton
 */
;(function (factory) {
        if (typeof exports !== 'undefined') {
            var typeOf = require('typeof--');
            var getFunctionName = require('typeof--/getFunctionName');
            var getConstructor = require('typeof--/getConstructor');

            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = factory(typeOf, getFunctionName, getConstructor);
            }
            exports.typeOf = factory(typeOf, getFunctionName, getConstructor);
        }else if (typeof define === 'function' && define.amd) {
            define(['typeof--/index','typeof--/getFunctionName', 'typeof--/getFunctionName'], factory);
        }
    }(function (typeOf, getFunctionName, getConstructor, undefined) {
        "use strict";
        function TypeOfBuilder(value, settings) {
            /**
             * store if we need to force object.prototype.toString in typeof--
             * @constant
             * @type {String}
             * @private
             */
            var FORCE_OBJECT_TOSTRING = settings.force;
            /**
             * store if value is an Object
             * @Constant
             * @type {Boolean}
             * @private
             */
            var IS_OBJECT = typeof value === "object";
            /**
             * store type of value
             * @Constant
             * @private
             * @type {String}
             */
            var VALUE_TYPE = typeOf(value, FORCE_OBJECT_TOSTRING);
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
                var arg_type = typeOf(arg, FORCE_OBJECT_TOSTRING);
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
                        if (arg.length === 0) {
                            return VALUE_TYPE === 'Array';
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

            //in case we don't want to create an Object.
            if (settings.hasOwnProperty('types')) {
                return _in(settings.types);
            } else {
                /**
                 * call _in function to check if type is among arguments
                 * @public
                 * @param {*} types
                 * @returns {Boolean}
                 */
                this.In = function (types) { //this.in is not supported by IE6
                    return _in(types);
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

        return function factory(value, types, forceObjectToString) {
            if (arguments.length === 1 || types === 'forceObjectToString') {
                return new TypeOfBuilder(value, {force: types});
            }
            if (arguments.length === 0) { //expose methods
                return {
                    'getType': function getType(value, force) {
                        return typeOf(value, force);
                    },
                    'In': function (value, types, forceObjectToString) {
                        return TypeOfBuilder(value, {types: types, force: forceObjectToString});
                    }
                };
            }
            //return _in result
            return TypeOfBuilder(value, {types: types, force: forceObjectToString});
        };
    })
);
