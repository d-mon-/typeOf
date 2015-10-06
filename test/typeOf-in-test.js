/**
 * Created by GUERIN Olivier, on 11/09/2015.
 * Twitter: @MisterRaton
 */
'use strict';
var test = require('tape');
var typeOf = require('../');

//################################test factory single arg################################
test('typeOf().getType()', function (assert) {
    var expected = 'String';
    var actual = typeOf('test').getType();
    assert.equal(actual, expected, "typeOf('test').getType() should return 'String'")
    assert.end()
});

test('null/undefined', function (assert) {
    var expected = true;
    var actual = typeOf(null).In('Null');
    assert.equal(actual, expected, "typeOf(null).In('Null') should return true");

    actual = typeOf(null).In(null);
    assert.equal(actual, expected, "typeOf(null).In(null) should return true");

    actual = typeOf(null).In('Object');
    assert.equal(actual, !expected, "typeOf(null).In({}) should return false");

    actual = typeOf(undefined).In('Undefined');
    assert.equal(actual, expected, "typeOf(undefined).In('Undefined') should return true");

    actual = typeOf(undefined).In(undefined);
    assert.equal(actual, expected, "typeOf(undefined).In(undefined) should return true");
    assert.end();
});

test('number', function (assert) {
    var expected = true;
    var actual = typeOf(42).In('Number');
    assert.equal(actual, expected, "typeOf(42).In('Number') should return true");

    actual = typeOf(new Number(42)).In('Number');
    assert.equal(actual, expected, "typeOf(new Number(42)).In('Number') should return true");

    actual = typeOf(42).In(666);
    assert.equal(actual, expected, "typeOf(42).In(666) should return true");

    actual = typeOf(3.14).In(Number);
    assert.equal(actual, expected, "typeOf(3.14).In(Number) should return true");

    actual = typeOf(NaN).In('NaN');
    assert.equal(actual, expected, "typeOf(NaN).In('NaN') should return true");

    actual = typeOf(NaN).In(NaN);
    assert.equal(actual, expected, "typeOf(NaN).In(NaN) should return true");

    actual = typeOf(NaN).In(Number);
    assert.equal(actual, !expected, "typeOf(NaN).In(Number) should return false");

    assert.end();
});


test('string', function (assert) {
    var expected = true;
    var actual = typeOf('').In('String');
    assert.equal(actual, expected, "typeOf('').In('String') should return true");

    actual = typeOf('myStringIsCute').In(String);
    assert.equal(actual, expected, "typeOf('myStringIsCute').In(String) should return true");

    actual = typeOf(new String('test')).In('String');
    assert.equal(actual, expected, "typeOf(new String()).In('String') should return true");

    assert.end();
});

test('boolean', function (assert) {
    var expected = true;
    var actual = typeOf(new Boolean()).In('Boolean');
    assert.equal(actual, expected, "typeOf(new Boolean()).In('Boolean') should return true");

    actual = typeOf(true).In('Boolean');
    assert.equal(actual, expected, "typeOf(true).In(false) should return true");

    actual = typeOf(true).In(false);
    assert.equal(actual, expected, "typeOf(true).In(false) should return true");

    actual = typeOf(true).In(Boolean);
    assert.equal(actual, expected, "typeOf(true).In(Boolean) should return true");

    assert.end();
});

test('array', function (assert) {
    var expected = true;
    var actual = typeOf([42]).In('Array');
    assert.equal(actual, expected, "typeOf([42]).In('Array') should return true");

    actual = typeOf([42]).In([]);
    assert.equal(actual, expected, "typeOf([42]).In([]) should return true");

    actual = typeOf([42]).In(Array);
    assert.equal(actual, expected, "typeOf(new Array(42)).In(Array) should return true");

    actual = typeOf([42]).In(Object);
    assert.equal(actual, expected, "typeOf([42]).In(Object) should return true");

    assert.end();
});

test('regex', function (assert) {
    var expected = true;
    var actual = typeOf(/test/).In('RegExp');
    assert.equal(actual, expected, "typeOf(/test/).In('RegExp') should return true");

    actual = typeOf(/test/).In(Object);
    assert.equal(actual, expected, "typeOf(/test/).In('Object') should return true");

    actual = typeOf(/test/).In(RegExp);
    assert.equal(actual, expected, "typeOf(/test/).In(RegExp) should return true");
    assert.end();
});

test('object', function (assert) {
    function Personnage() {
    };
    var Person = Personnage;
    var Person2 = function Personnage() {
    };

    var person = new Person();
    var _person = new Person();
    var __person = new Personnage();
    var person2 = new Person2();

    var expected = true;
    var actual = typeOf({}).In('Object');
    assert.equal(actual, expected, "typeOf({}).In('Object') should return true");

    actual = typeOf({}).In({});
    assert.equal(actual, expected, "typeOf({}).In({}) should return true");

    actual = typeOf({}).In(Object);
    assert.equal(actual, expected, "typeOf({}).In(Object) should return true");

    actual = typeOf(new Object()).In(Object);
    assert.equal(actual, expected, "typeOf(new Object()).In(Object) should return true");


    actual = typeOf(person).In(Person);
    assert.equal(actual, expected, "typeOf(person).In(Person) should be true");

    actual = typeOf(person2).In(Personnage);
    assert.equal(actual, !expected, "typeOf(person2).In(Person) should be false");

    actual = typeOf(person).In(_person);
    assert.equal(actual, expected, "typeOf(person).In(_person) should return true");

    actual = typeOf(person).In(__person);
    assert.equal(actual, expected, "typeOf(person).In(__person) should return true");

    actual = typeOf(person).In(person2);
    assert.equal(actual, !expected, "typeOf(person).In(person2) should return false");

    actual = typeOf(person2).In('Personnage');
    assert.equal(actual, expected, "typeOf(person2).In('Personnage') should return true");

    actual = typeOf(person2).In('Object');
    assert.equal(actual, !expected, "typeOf(person2).In('Object') should return false");

    actual = typeOf(person2).In(Object);
    assert.equal(actual, expected, "typeOf(person2).In(Object) should return true");

    assert.end();
});


test('function', function (assert) {
    var expected = true;
    var actual = typeOf(function () {}).In('Function');
    assert.equal(actual, expected, "typeOf(function(){}).In('Function') should return true");

    actual = typeOf(String).In('Function');
    assert.equal(actual, expected, " typeOf(String).In('Function'); should return true");

    actual = typeOf(String).In(Function);
    assert.equal(actual, expected, "typeOf(String).In(Function) should return true");

    actual = typeOf(()=>{}).In('Function');
    assert.equal(actual, expected, "typeOf(()=>{}).In('Function') should return true");

    actual = typeOf(()=>{}).In(Function);
    assert.equal(actual, expected, "typeOf(()=>{}).In('Function') should return true");

    assert.end();
});

test('error', function (assert) {
    var expected = true;
    var actual = typeOf(new TypeError()).In('TypeError');
    assert.equal(actual, expected, "typeOf(new TypeError()).In('TypeError') should return true");

    actual = typeOf(new TypeError()).In('Error');
    assert.equal(actual, !expected, "typeOf(new TypeError()).In('Error'); should return true");

    actual = typeOf(new Error()).In('Error');
    assert.equal(actual, expected, " typeOf(new Error()).In('Error'); should return true");

    actual = typeOf(new TypeError()).In(Error);
    assert.equal(actual, expected, "typeOf(new TypeError()).In(Error); should return true");

    assert.end();
});

test('generator', function (assert) {
    var expected = true;
    var actual = typeOf(function*() {}).In('GeneratorFunction');
    assert.equal(actual, expected, "typeOf(function*(){}).In('GeneratorFunction') should return true");

    actual = typeOf(function*() {}).In(function*() {});
    assert.equal(actual, expected, "typeOf(function*(){}).In(function*(){}) should return true");
    assert.end()
});

test('JSON/Math', function(assert){
    var expected = true;
    var actual = typeOf(JSON).In('JSON');
    assert.equal(actual, expected, "typeOf(JSON).In('JSON') should return true");

    actual = typeOf(JSON).In(JSON);
    assert.equal(actual, expected, "typeOf(JSON).In(JSON) should return true");

    actual = typeOf(Math).In('Math');
    assert.equal(actual, expected, " typeOf(Math).In('Math') should return true");

    actual = typeOf(Math).In(Math);
    assert.equal(actual, expected, " typeOf(Math).In(Math) should return true");
    assert.end()

})

test('class', function (assert) {
    class Model {
        constructor(properties) {
            this.properties = properties;
        }

        toObject() {
            return this.properties;
        }
    }
    class Model2 {
        constructor(properties) {
            this.properties = properties;
        }

        toObject() {
            return this.properties;
        }
    }
    var __Model = class Model {
        constructor(properties) {
            this.properties = properties;
        }

        toObject() {
            return this.properties;
        }
    };
    var expected = true;
    var actual = typeOf(new Model()).In('Model');
    assert.equal(actual, expected, "typeOf(new Model()).In('Model') should return true");

    actual = typeOf(new Model()).In(Model);
    assert.equal(actual, expected, "typeOf(new Model()).In(Model) should return true");

    actual = typeOf(new Model()).In(new Model());
    assert.equal(actual, expected, "typeOf(new Model()).In(new Model()) should return true");

    actual = typeOf(new Model()).In(new Model2());
    assert.equal(actual, !expected, "typeOf(new Model()).In(new Model2()) should return true");

    actual = typeOf(new Model()).In(new __Model());
    assert.equal(actual, !expected, "typeOf(new Model()).In(new __Model()) should return true");
    assert.end()
});


test('Anonymous',function(assert) {
    var myAnonymous = function(){};
    
    var expected = true;
    var actual = typeOf(new myAnonymous()).In('#Anonymous');
    assert.equal(actual, expected, "typeOf(new (function(){})).In('#Anonymous') should return true");

    var actual = typeOf(new myAnonymous()).In('myAnonymous');
    assert.equal(actual, !expected, "typeOf(new (function(){})).In('myAnonymous') should return false");

    var actual = typeOf(new myAnonymous()).In(new (function(){}));
    assert.equal(actual, !expected, "typeOf(new (myAnonymous)).In(new (function(){})) should return false");

    var actual = typeOf(new myAnonymous()).In(myAnonymous);
    assert.equal(actual, expected, " typeOf(new (myAnonymous)).In(myAnonymous) should return true");

    var actual = typeOf(new myAnonymous()).In(new myAnonymous());
    assert.equal(actual, expected, " typeOf(new (myAnonymous)).In(myAnonymous) should return true");

    var actual = typeOf(new myAnonymous()).In(Object);
    assert.equal(actual, expected, " typeOf(new (myAnonymous)).In(myAnonymous) should return true");

    assert.end()
});
//################################Test regex#############################################

test('regexp testing', function (assert) {
    var person = new (function Personnage() {
    });
    var expected = true;
    var actual = typeOf(person).In(/^Person.*/);
    assert.equal(actual, expected, "typeOf(Person).In(/^Person.*/); should return true");
    assert.end();
});
//################################Test factory multi args################################

test('array of string', function (assert) {
    var expected = true;
    var actual = typeOf('myStringIsCute').In(['Number', 'Object', 'String']);
    assert.equal(actual, expected, "typeOf('myStringIsCute').In(['Number','String','Object']) should return true")

    actual = typeOf('myStringIsCute').In(['Number', 'Object']);
    assert.equal(actual, !expected, "typeOf('myStringIsCute').In(['Number','Object']) should return false")

    //nested
    actual = typeOf('myStringIsCute').In(['Number', ['Object', ['String']]]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').In(['Number',['Object',['String']]]) should return false")

    assert.end();
});

test('array of Constructor', function (assert) {
    var expected = true;
    var actual = typeOf('myStringIsCute').In([Number, Object, String]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').In([Number,String,Object]) should return true")

    actual = typeOf('myStringIsCute').In([Number, Object]);
    assert.equal(actual, !expected, "typeOf('myStringIsCute').In([Number,Object]) should return false");

    //nested
    actual = typeOf('myStringIsCute').In([Number, [{}, [], [String]]]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').In([Number,[{},[],[String]]]) should return false")

    assert.end();
});

test('multi arguments', function (assert) {
    var expected = true;
    var actual = typeOf('myStringIsCute').In(Number, [], 'String');
    assert.equal(actual, expected, "typeOf('myStringIsCute').In(Number,[],'String') should return true")

    actual = typeOf('myStringIsCute').In(Number, [], [Object, String]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').In(Number,[],[Object,String]) should return true")
    assert.end();
});

test('typeof-function-oriented' , function (assert) {
    var expected = true;
    var actual = typeOf('myStringIsCute',Number, [], 'String');
    assert.equal(actual, expected, "typeOf('myStringIsCute',Number, [], 'String'); should return true")

    actual = typeOf('myStringIsCute','String');
    assert.equal(actual, expected, "typeOf('myStringIsCute', 'String'); should return true")

    actual = typeOf('myStringIsCute',[Number, [], Object, String]);
    assert.equal(actual, expected, " typeOf('myStringIsCute',[Number, [], Object, String]) should return true")

    actual = typeOf().In('myStringIsCute',Number, [], 'String');
    assert.equal(actual, expected, "typeOf.In('myStringIsCute',Number, [], 'String') should return true")

    actual = typeOf().In('myStringIsCute',[Number, [], 'String']);
    assert.equal(actual, expected, "typeOf.In('myStringIsCute',[Number, [], Object, String]) should return true")

    actual = typeOf().getType('lolipop');
    expected = 'String';
    assert.equal(actual, expected, "typeOf.getType('lolipop') should return 'String'");


    assert.end();
});


//############################ regressive test ###############################
test('typeof-function-oriented' , function (assert) {
    var expected = true;
    var actual = typeOf(new (function Null(){})()).In(null);
    assert.equal(actual, !expected, "typeOf(new (function Null(){})()).In(null) should return false")

    actual = typeOf(new (function Undefined(){})()).In(undefined);
    assert.equal(actual, !expected, "typeOf(new (function Undefined(){})()).In(undefined); should return false")

    actual = typeOf(Array.prototype).In('Array');
    assert.equal(actual, expected, " typeOf(Array.prototype).In('Array') should return true");

    actual = typeOf(Array.prototype).In(Array);
    assert.equal(actual, !expected, " typeOf(Array.prototype).In(Array) should return false");

    actual = typeOf(Array.prototype).In(Object);
    assert.equal(actual, expected, " typeOf(Array.prototype).In(Object) should return true");

    actual = typeOf(Object.prototype).In(Object);
    assert.equal(actual, !expected, " typeOf(Objecty.prototype).In(Object) should return true");

    assert.end();
});