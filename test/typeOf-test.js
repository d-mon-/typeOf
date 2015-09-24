/**
 * Created by GUERIN Olivier, on 14/09/2015.
 * Twitter: @MisterRaton
 */
'use strict'
const assert = require('assert');
const typeOf = require('../typeOf');
var count=0,total=0;

function log(value, expect) {
    let _type = typeOf(value);
    let _r = _type === expect;
    if (_r) {
        console.log('ok :', _type, '==>', expect)
        count++;
    } else {
        console.log('not ok :', _type, '==>', expect)
        console.log(value);
    }
    total++;
}

//#null
log(null, 'Null');

//#undefined
log(undefined, 'Undefined');

//#NaN
log(NaN, 'NaN');

//#String
log(new String('test'), 'String');
log(String, 'Function');
log('test', 'String');

//#Number
log(new Number(42), 'Number');
log(42, 'Number');
log(Number, 'Function');

//#Boolean
log(new Boolean(false), 'Boolean');
log(false, 'Boolean');
log(Boolean, 'Function');

//#Array
log([], 'Array');
log(Array, 'Function')
log(new Array(), 'Array')

//#Object
log({}, 'Object');
log(Object, 'Function');
log(new Object(), 'Object');

//#Symbol
try {
    log(Symbol, 'Function');
    log(Symbol("Foo"), 'Symbol');
} catch (err) {
    console.log(err.message, '-> SKIP')
}


//#regexp
log(/test/, 'RegExp')
log(new RegExp(), 'RegExp');
log(RegExp, 'Function')

//#function
log(Function, 'Function');
log(new Function(), 'Function');
log(function () {
}, 'Function');
try {
    log(()=> {
    }, 'Function');
} catch (err) {
    console.log(err.message, '-> SKIP')
}
//#generators
try {
    log(function*() {
    }, 'GeneratorFunction');
    log(GeneratorFunction, 'Function');
    log(new GeneratorFunction(), 'GeneratorFunction')
} catch (err) {
    console.log(err.message, '-> SKIP')
}
//#Promise
try {
    log(Promise, 'Function');
    log(new Promise(function () {
    }), 'Promise');
} catch (err) {
    console.log(err.message, '-> SKIP')
}

//#TypedArray
try {
    log(new Uint32Array(), 'Uint32Array');
    log(new ArrayBuffer(), 'ArrayBuffer');
    log(new DataView(new ArrayBuffer()), 'DataView');
} catch (err) {
    console.log(err.message, '-> SKIP')
}

//#Error
log(new Error(), 'Error');
log(Error, 'Function');
log(new TypeError(), 'TypeError');

//#map/set
try {
    log(new Map(), 'Map');
    log(new Set(), 'Set');
} catch (err) {
    console.log(err.message, '-> SKIP')
}

//#Date
log(new Date(), 'Date');
try {
    log(new Iterator('a'), 'Iterator');
    log(Iterator, 'Function');
} catch (err) {
    console.log(err.message, '-> SKIP');
}

//#special
log(new(function $(){}), '$');
log(new(function _(){}), '_');
log(new(function (){}) , '#Anonymous');

console.log('RESULT: '+count+'/'+total+' passed');