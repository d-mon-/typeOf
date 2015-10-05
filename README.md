# Typeof-in ( + instanceof )
allow you to compare the type (or instance) of your value with several types (or constructor), and finally return a **Boolean**.

compatible with **IE**

**Consider using [lodash](https://lodash.com) or [kind-of](https://www.npmjs.com/package/kind-of) first!**
# Use cases:
```js
    var typeOf = require('typeof-in'); 
```
## Through an object
### basic:
You can retrieve the type or compare it with a string representing an expecting type.
```js
typeOf('test').getType(); //return 'String' (see 'typeOf only' below);

//return a Boolean, in these cases: true.
typeOf('lolipop').In('String');
typeOf(null).In('Null');
typeOf(undefined).In('Undefined');
typeOf(NaN).In('NaN');
typeOf(new Number(NaN)).In('NaN');
```

### multi:

You might also want to compare your value with a set of different types.

```js
//using an Array (better performance)
typeOf('lolipop').In(['Number', 'String', 'Object','Array']);
//or multiple arguments
typeOf('lolipop').In('Number', 'String', 'Object', 'Array');
```

### regex:
Furthermore, typeof-in also supports Regex against your value, 

which is quite useful with < ****Error> types for example. [about Error types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
```js
typeOf(new TypeError()).In(/.+Error$/); //is an error other than 'Error' type
```

### ES6 and others objects:
This library can check all kind of objects. Allowing you to compare *ES6* features like Promises, Generators, fat arrows... which is pretty neat.
```js
typeOf(new Promise(function(){}).In('Promise')
typeOf(function*(){}).In('GeneratorFunction')
typeOf(()=>{}).In('Function')
```

### calling several times:
This is the main advantage of using typeof-in through an object, it allows you to deal with the same value in different ways
```js
var myType = typeOf('test');
//call the "in" method several times
if(myType.In('String')){
    //do something with the value as a string
}else if(myType.In(['Null','Undefined'])){
    //you need to init your value!
}else if(myType.In(/.+Error$/)){
    //something bad happened! but not a global error
}else if(myType.In(Error)){
    //global error handler... :(
}
```

### some other tricks:
*it might impact performance*

If the value passed inside typeOf is not an Object, its **in()** method will never call instanceof when a constructor is passed as parameter, however, it will retrieve its constructor name to check if it match the type of your value. (**important:** some constructors are not supported by all browsers)

Therefore, you can use typeOf-in like this:
```js
//with contructors
var GeneratorFunction = (function*(){}).constructor;
typeOf(1).In([null, undefined,NaN,Array,Object,Number,String,GeneratorFunction,Function])

//is equal to
typeOf(1).In(['Null','Undefined','NaN','Array','Object','Number','String','GeneratorFunction','Function'])
```

### dealing with instanceof:
The following examples show different cases when typeof-in will use instanceof to compare the value with the constructor of a prototype.

However, the library will not return an empty string('') but a "#Anonymous" value in the case of an instance of an anonymous prototype. 
```js
    //with primitive value, if the type passed in "in()" is a constructor, then typeof-in will retrieve its constructor name
    typeOf(42).In(Number)  // is equal to typeOf(42).In('Number')
    typeOf(new Number(42)).In(Number) //will use instanceof

    typeOf(new String('test')).In(String)
    typeOf({}).In(Object)
    typeOf([]).In(Object)   //return true
    typeOf([]).In(Array)    //return true
    typeOf([]).In('Object') //return true, an Array is an Object
    typeOf([]).In('Array')  //return true
    //typeOf(/myRegex/) has the same behavior than Array.
    
    typeOf(new TypeError()).In(Error)      //true
    typeOf(new TypeError()).In(TypeError)  //true
    typeOf(new TypeError()).In('TypeError')//true, a TypeError is an Error
    typeOf(new TypeError()).In('Error')    //true
    
    
    //OR

    function Human(){}; // ES6: class Human {}
    var Person = Human;
    var Person2 = function Human(){};

    var person = new Person();
    var _person = new Person();
    var __person = new Human();
    var person2 = new Person2();  
    
    //#instance against instance
    //if one of them has a constructor, use: x instanceof y.constructor
    //otherwise, compare types as String.
    typeOf(person).In(_person); //true
    typeOf(person).In(__person); //true    
    typeOf(person).In(person2); //false
    
    //#instance against constructor
    typeOf(person).In(Person); //true   
    typeOf(person).In(Human); //true
    typeOf(person2).In(Human); //false
    typeOf(person2).In('Human'); //true
    typeOf(person2).In(Object); //true
    typeOf(person2).In('Object'); //true
    
    typeOf(person).getType(); // return 'Human'
    typeOf(person2).getType(); //return 'Human'
    typeOf(new(function $(){})).getType(); //return '$'
    typeOf(new(function _(){})).getType(); //return '_'
    
    //#special cases: instance of Anonymous (it behaves as the above examples)
    var myAnonymous = function(){};
    typeOf(new(function (){})).getType(); //return '#Anonymous'
    typeOf(new (myAnonymous)).In('#Anonymous') //true
    typeOf(new (myAnonymous)).In(myAnonymous) //true
    typeOf(new (myAnonymous)).In(Object) //true
    typeOf(new (myAnonymous)).In('Object') //true
    typeOf(new (myAnonymous)).In(new(function(){})) //false
    
```


## Through a function
*decrease readability*

The recent version of typeof-in (>= 3.0.0) allows you to directly call the function in charge of the comparison, and by extension, not create an object every time you use typeOf() in your code. 

This feature works exactly like the previous examples.

```js
//for comparison: with one argument (default behavior)
typeOfIn('lolipop').In([Number, [], 'String']); 

//with more than one argument:
var typeOfIn = typeOf;
typeOfIn('lolipop',Number, [], 'String'); 
typeOfIn('lolipop',[Number, [], 'String']); 

//with zero argument : typeof-in expose getType() and in().
var typeOf = require('typeof-in')();
typeOf.getType('lolipop') //'String'
typoOf.In('lolipop',Number, [], 'String');
typoOf.In('lolipop',[Number, [], 'String']);

```


# Why use *typeof-in* ? 
## JS is, somehow, broken
```js
console.log(typeof null) // 'object'
console.log(null instanceof Object) //false
``` 
null shouldn't be an object... And even if it is the case in JavaScript, null is not even an instance of Object...

```js
console.log(typeof /regularexpression/) // 'object'
```
every time I see this line, I would expect *'regexp'*

```js
console.log(typeof new Number(42)) //'object'
console.log(typeof 42) //'number'
```
new Number(42) and 42 have the same constructor name, but doesn't have the same type...
(String and Boolean have the same "problem")

```js
console.log(typeof NaN) //'number'
console.log(typeof new Number(NaN)) //'object'
```
And one of the most famous example in JS is NaN (a.K.a Not A Number) which return a type of number...

and some more...

## Important

[typeof--](https://www.npmjs.com/package/typeof--) uses **constructor(.name)** when possible, and is therefore influenced by the change of the constructor function!

Which imply that: an object "A" deriving from another object "B" will have the constructor of "B" and not "A", you can avoid this problem by using Object.assign, _.assign or _.extend...

Moreover, any change on the constructor will modify the type returned (cf: [See the table of typeof--](https://github.com/d-mon-/typeof--#tables-of-common-values) ).

To avoid such problem, you must trigger **instanceof** by passing constructors.
```js
var typeOf = require('typeof-in');

function Example(){};

var test = new Example('test'); 
//before constructor corruption
typeOf(test).In('Example') //true
typeOf(test).In('Object')  //true
typeOf(test).In(Example)   //true
typeOf(test).In(Object)    //true

Object.getPrototypeOf(test).constructor = test.constructor = function hacked(){} //typeOf(test).getType() will return 'Object'

//after constructor corruption
typeOf(test).In('Example') //false
typeOf(test).In('Object')  //true
typeOf(test).In(Example)   //true
typeOf(test).In(Object)    //true
```

## typeof-in supports:

- Regex
- Multi choices
- both: new String('test') and 'test' return the same type
- same thing with *Numbers* and *Booleans*
- NaN, Undefined, Null values have their own types 
- use instanceof when necessary: typeOf(instance).In(constructor)
- and more!

In some ways, it is the fusion of **typeof** and **instanceof**

## You can check the following types:

> - 'Boolean' / 'String' / 'Number' / 'Symbol' 
>
> - 'NaN' / 'Undefined' / 'Null'
>
> - 'Function' / 'GeneratorFunction' / 'Iterator' / 'Promise
>
> - Error / TypeError / ...
>
> - HTMLDocument / ...
>
> - RegExp
>
> - Array / ArrayBuffer / UInt32Array / (Weak)Map / (Weak)Set / ...
>
> - built-in Objects like JSON and Math
>
>   and many more... (in fact, you can check almost everything)

[JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)

# with requireJS (AMD)

```js
/*
make sure to change the paths and module names according to your projects.
*/
require.config({
            baseUrl: "/",
            paths: {
                'typeof--':'./typeof--', //typeof-- directory path
                'typeOf':'./index' //typeOf index file path
            }
        });

        requirejs(['typeOf'], function(typeOf) {
                console.log(typeof typeOf);
                console.log(typeOf(42).getType());
                console.log(typeOf(42).In('Number'));
        });
```
[see the following example](https://github.com/d-mon-/typeOf/tree/master/example)

# TypeOf only
In the case you only need the function used to retrieve the type of a value as a *String* (like typeof), you might be interested in the following library:
 
[typeof--](https://www.npmjs.com/package/typeof--)

# NPM commands
> npm install typeof-in --save
>
> npm test
    
Finally, I'm open to any suggestions
