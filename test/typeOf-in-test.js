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
    var actual = typeOf(null).in('Null');
    assert.equal(actual, expected, "typeOf(null).in('Null') should return true");

    actual = typeOf(null).in(null);
    assert.equal(actual, expected, "typeOf(null).in('Null') should return true");

    actual = typeOf(null).in('Object');
    assert.equal(actual, !expected, "typeOf(null).in({}) should return false");

    actual = typeOf(undefined).in('Undefined');
    assert.equal(actual, expected, "typeOf(undefined).in('Undefined') should return true");

    actual = typeOf(undefined).in(undefined);
    assert.equal(actual, expected, "typeOf(undefined).in(undefined) should return true");
    assert.end();
});

test('number', function (assert) {
    var expected = true;
    var actual = typeOf(42).in('Number');
    assert.equal(actual, expected, "typeOf(42).in('Number') should return true");

    actual = typeOf(new Number(42)).in('Number');
    assert.equal(actual, expected, "typeOf(new Number(42)).in('Number') should return true");

    actual = typeOf(42).in(666);
    assert.equal(actual, expected, "typeOf(42).in(666) should return true");

    actual = typeOf(3.14).in(Number);
    assert.equal(actual, expected, "typeOf(3.14).in(Number) should return true");

    actual = typeOf(NaN).in('NaN');
    assert.equal(actual, expected, "typeOf(NaN).in('NaN') should return true");

    actual = typeOf(NaN).in(NaN);
    assert.equal(actual, expected, "typeOf(NaN).in(NaN) should return true");

    actual = typeOf(NaN).in(Number);
    assert.equal(actual, !expected, "typeOf(NaN).in(Number) should return false");

    assert.end();
});


test('string', function (assert) {
    var expected = true;
    var actual = typeOf('').in('String');
    assert.equal(actual, expected, "typeOf('').in('String') should return true");

    typeOf('').in('');
    assert.equal(actual, expected, "typeOf('').in('') should return true");

    actual = typeOf('myStringIsCute').in(String);
    assert.equal(actual, expected, "typeOf('myStringIsCute').in(String) should return true");

    actual = typeOf(new String('test')).in('String');
    assert.equal(actual, expected, "typeOf(new String()).in('String') should return true");

    assert.end();
});

test('boolean', function (assert) {
    var expected = true;
    var actual = typeOf(new Boolean()).in('Boolean');
    assert.equal(actual, expected, "typeOf(new Boolean()).in('Boolean') should return true");

    actual = typeOf(true).in('Boolean');
    assert.equal(actual, expected, "typeOf(true).in(false) should return true");

    actual = typeOf(true).in(false);
    assert.equal(actual, expected, "typeOf(true).in(false) should return true");

    actual = typeOf(true).in(Boolean);
    assert.equal(actual, expected, "typeOf(true).in(Boolean) should return true");

    assert.end();
});

test('array', function (assert) {
    var expected = true;
    var actual = typeOf([42]).in('Array');
    assert.equal(actual, expected, "typeOf([42]).in('Array') should return true");

    actual = typeOf([42]).in([]);
    assert.equal(actual, expected, "typeOf([42]).in([]) should return true");

    actual = typeOf([42]).in(Array);
    assert.equal(actual, expected, "typeOf(new Array(42)).in(Array) should return true");

    //regression test
    actual = typeOf([42]).in('Object');
    assert.equal(actual, expected, "typeOf([42]).in('Object') should return true");

    actual = typeOf([42]).in(Object);
    assert.equal(actual, expected, "typeOf([42]).in(Object) should return true");

    assert.end();
});

test('regex', function (assert) {
    var expected = true;
    var actual = typeOf(/test/).in('RegExp');
    assert.equal(actual, expected, "typeOf(/test/).in('RegExp') should return true");

    actual = typeOf(/test/).in('Object');
    assert.equal(actual, expected, "typeOf(/test/).in('Object') should return true");

    actual = typeOf(/test/).in(RegExp);
    assert.equal(actual, expected, "typeOf(/test/).in(RegExp) should return true");
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
    var actual = typeOf({}).in('Object');
    assert.equal(actual, expected, "typeOf({}).in('Object') should return true");

    actual = typeOf({}).in({});
    assert.equal(actual, expected, "typeOf({}).in({}) should return true");

    actual = typeOf({}).in(Object);
    assert.equal(actual, expected, "typeOf({}).in(Object) should return true");

    actual = typeOf(new Object()).in(Object);
    assert.equal(actual, expected, "typeOf(new Object()).in(Object) should return true");


    actual = typeOf(person).in(Person);
    assert.equal(actual, expected, "typeOf(person).in(Person) should be true");

    actual = typeOf(person2).in(Personnage);
    assert.equal(actual, !expected, "typeOf(person2).in(Person) should be false");

    actual = typeOf(person).in(_person);
    assert.equal(actual, expected, "typeOf(person).in(_person) should return true");

    actual = typeOf(person).in(__person);
    assert.equal(actual, expected, "typeOf(person).in(__person) should return true");

    actual = typeOf(person).in(person2);
    assert.equal(actual, !expected, "typeOf(person).in(person2) should return false");

    actual = typeOf(person2).in('Personnage');
    assert.equal(actual, expected, "typeOf(person2).in('Personnage') should return true");

    actual = typeOf(person2).in('Object');
    assert.equal(actual, expected, "typeOf(person2).in('Object') should return true");

    actual = typeOf(person2).in(Object);
    assert.equal(actual, expected, "typeOf(person2).in(Object) should return true");

    assert.end();
});


test('function', function (assert) {
    var expected = true;
    var actual = typeOf(function () {}).in('Function');
    assert.equal(actual, expected, "typeOf(function(){}).in('Function') should return true");

    actual = typeOf(String).in('Function');
    assert.equal(actual, expected, " typeOf(String).in('Function'); should return true");

    actual = typeOf(String).in(function(){});
    assert.equal(actual, expected, "typeOf(String).in(Function) should return true");

    actual = typeOf(String).in(Function);
    assert.equal(actual, expected, "typeOf(String).in(Function) should return true");

    actual = typeOf(()=>{}).in(Function);
    assert.equal(actual, expected, "typeOf(()=>{}).in('Function') should return true");

    assert.end();
});

test('error', function (assert) {
    var expected = true;
    var actual = typeOf(new TypeError()).in('TypeError');
    assert.equal(actual, expected, "typeOf(new TypeError()).in('TypeError') should return true");

    actual = typeOf(new TypeError()).in('Error');
    assert.equal(actual, expected, "typeOf(new TypeError()).in('Error'); should return true");

    actual = typeOf(new Error()).in('Error');
    assert.equal(actual, expected, " typeOf(new Error()).in('Error'); should return true");

    actual = typeOf(new TypeError()).in(Error);
    assert.equal(actual, expected, "typeOf(new TypeError()).in(Error); should return true");

    assert.end();
});

test('generator', function (assert) {
    var expected = true;
    var actual = typeOf(function*() {}).in('GeneratorFunction');
    assert.equal(actual, expected, "typeOf(function*(){}).in('GeneratorFunction') should return true");

    actual = typeOf(function*() {}).in(function*() {});
    assert.equal(actual, expected, "typeOf(function*(){}).in(function*(){}) should return true");
    assert.end()
});

test('JSON/Math', function(assert){
    var expected = true;
    var actual = typeOf(JSON).in('JSON');
    assert.equal(actual, expected, "typeOf(JSON).in('JSON') should return true");

    actual = typeOf(JSON).in(JSON);
    assert.equal(actual, expected, "typeOf(JSON).in(JSON) should return true");

    actual = typeOf(JSON).in('Object');
    assert.equal(actual, expected, "typeOf(JSON).in(JSON) should return true");

    actual = typeOf(Math).in('Math');
    assert.equal(actual, expected, " typeOf(Math).in('Math') should return true");

    actual = typeOf(Math).in(Math);
    assert.equal(actual, expected, " typeOf(Math).in(Math) should return true");
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
    var actual = typeOf(new Model()).in('Model');
    assert.equal(actual, expected, "typeOf(new Model()).in('Model') should return true");

    actual = typeOf(new Model()).in(Model);
    assert.equal(actual, expected, "typeOf(new Model()).in(Model) should return true");

    actual = typeOf(new Model()).in(new Model());
    assert.equal(actual, expected, "typeOf(new Model()).in(new Model()) should return true");

    actual = typeOf(new Model()).in(new Model2());
    assert.equal(actual, !expected, "typeOf(new Model()).in(new Model2()) should return true");

    actual = typeOf(new Model()).in(new __Model());
    assert.equal(actual, !expected, "typeOf(new Model()).in(new __Model()) should return true");
    assert.end()
});


test('Anonymous',function(assert) {
    var myAnonymous = function(){};
    
    var expected = true;
    var actual = typeOf(new (myAnonymous)).in('#Anonymous');
    assert.equal(actual, expected, "typeOf(new (function(){})).in('#Anonymous') should return true");

    actual = typeOf(new (myAnonymous)).in('Object');
    assert.equal(actual, expected, "typeOf(new (function(){})).in('true') should return true");

    var actual = typeOf(new (myAnonymous)).in('myAnonymous');
    assert.equal(actual, !expected, "typeOf(new (function(){})).in('myAnonymous') should return false");

    var actual = typeOf(new (myAnonymous)).in(function(){});
    assert.equal(actual, !expected, "typeOf(new (myAnonymous)).in(function(){}) should return false");

    var actual = typeOf(new (myAnonymous)).in(new (function(){}));
    assert.equal(actual, !expected, "typeOf(new (myAnonymous)).in(new (function(){})) should return false");

    var actual = typeOf(new (myAnonymous)).in(myAnonymous);
    assert.equal(actual, expected, " typeOf(new (myAnonymous)).in(myAnonymous) should return true");

    var actual = typeOf(new (myAnonymous)).in(new (myAnonymous));
    assert.equal(actual, expected, " typeOf(new (myAnonymous)).in(myAnonymous) should return true");

    var actual = typeOf(new (myAnonymous)).in(Object);
    assert.equal(actual, expected, " typeOf(new (myAnonymous)).in(myAnonymous) should return true");

    assert.end()
});
//################################Test regex#############################################

test('regexp testing', function (assert) {
    var person = new (function Personnage() {
    });
    var expected = true;
    var actual = typeOf(person).in(/^Person.*/);
    assert.equal(actual, expected, "typeOf(Person).in(/^Person.*/); should return true");
    assert.end();
});
//################################Test factory multi args################################

test('array of string', function (assert) {
    var expected = true;
    var actual = typeOf('myStringIsCute').in(['Number', 'Object', 'String']);
    assert.equal(actual, expected, "typeOf('myStringIsCute').in(['Number','String','Object']) should return true")

    actual = typeOf('myStringIsCute').in(['Number', 'Object']);
    assert.equal(actual, !expected, "typeOf('myStringIsCute').in(['Number','Object']) should return false")

    //nested
    actual = typeOf('myStringIsCute').in(['Number', ['Object', ['String']]]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').in(['Number',['Object',['String']]]) should return false")

    assert.end();
});

test('array of Function/primitive', function (assert) {
    var expected = true;
    var actual = typeOf('myStringIsCute').in([Number, Object, String]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').in([Number,String,Object]) should return true")

    actual = typeOf('myStringIsCute').in([Number, Object]);
    assert.equal(actual, !expected, "typeOf('myStringIsCute').in([Number,Object]) should return false");

    actual = typeOf(42).in([[], null, undefined, {}, 3.14]);
    assert.equal(actual, expected, "typeOf(42).in(['String',{},3.14]) should return true");

    actual = typeOf('test').in([[], null, undefined, {}, 3.14,'']);
    assert.equal(actual, expected, "typeOf('test').in([[], null, undefined, {}, 3.14,'']) should return true");

    //nested
    actual = typeOf('myStringIsCute').in([Number, [{}, [], [String]]]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').in([Number,[{},[],[String]]]) should return false")

    assert.end();
});

test('multi arguments', function (assert) {
    var expected = true;
    var actual = typeOf('myStringIsCute').in(Number, [], 'String');
    assert.equal(actual, expected, "typeOf('myStringIsCute').in(Number,[],'String') should return true")

    actual = typeOf('myStringIsCute').in(Number, [], [Object, String]);
    assert.equal(actual, expected, "typeOf('myStringIsCute').in(Number,[],[Object,String]) should return true")
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

    actual = typeOf().in('myStringIsCute',Number, [], 'String');
    assert.equal(actual, expected, "typeOf.in('myStringIsCute',Number, [], 'String') should return true")

    actual = typeOf().in('myStringIsCute',[Number, [], 'String']);
    assert.equal(actual, expected, "typeOf.in('myStringIsCute',[Number, [], Object, String]) should return true")

    actual = typeOf().getType('lolipop');
    expected = 'String';
    assert.equal(actual, expected, "typeOf.getType('lolipop') should return 'String'");


    assert.end();
});