/**
 * Created by GUERIN Olivier, on 17/10/2015.
 * Twitter: @MisterRaton
 */



test('generator', function (assert) {
    var expected = true;
    var actual = typeOf(function*() {}).In('GeneratorFunction');
    assert.equal(actual, expected, "typeOf(function*(){}).In('GeneratorFunction') should return true");

    actual = typeOf(function*() {}).In(function*() {});
    assert.equal(actual, expected, "typeOf(function*(){}).In(function*(){}) should return true");
    assert.end()
});

test('fat arrow', function (assert) {
    var expected = true;
    var actual = typeOf(()=>{}).In('Function');
    assert.equal(actual, expected, "typeOf(()=>{}).In('Function') should return true");

    actual = typeOf(()=>{}).In(Function);
    assert.equal(actual, expected, "typeOf(()=>{}).In('Function') should return true");
    assert.end()
});


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

