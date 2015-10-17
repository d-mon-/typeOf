# TypeOf-In [![npm version][npm-image-v]][npm-url] [![npm download][npm-image-dm]][npm-url] [![npm total][npm-image-dt]][npm-url] 
#### allows your values to be compared with a set of **Constructors** or **Strings** representing the expected type. 

[![build status][travis-image]][travis-url] 

[![saucelabs matrix][saucelabs-matrix]][saucelabs-url]

[travis-image]: https://img.shields.io/travis/d-mon-/typeOf.svg?style=flat
[travis-url]: https://travis-ci.org/d-mon-/typeOf
[npm-image-dt]:https://img.shields.io/npm/dt/typeof-in.svg?style=flat
[npm-image-dm]:https://img.shields.io/npm/dm/typeof-in.svg?style=flat
[npm-image-v]: https://img.shields.io/npm/v/typeof-in.svg?style=flat
[npm-url]: https://npmjs.org/package/typeof-in
[saucelabs-matrix]: https://saucelabs.com/browser-matrix/onegai.svg
[saucelabs-url]: https://saucelabs.com/u/onegai

# Foretaste:
```js
    var typeOf = require('typeof-in'); 
    typeOf('lollipop').In([null, undefined, NaN, Number, Array, Object]) 
```
# Why use *TypeOf-In* ? 
## typeof and instanceof are, somehow, broken
### null
For example, **null** has a type of an object, but it is not an instance of Object.
```js
typeof null; // 'object'
null instanceof Object //false
``` 
**\[fun fact\]** *Object.prototype* has the same result as *null* with *typeof* and *instanceof*

### RegEx
Using a regular expression literal, someone would expect **typeof** to return a specific value like **"regexp"** which would be great in a perfect world.
```js
typeof /regularExpression/ // 'object'
/regularExpression/ instanceof RegExp // true
```
So, if you're dealing with regex, use instanceof.
### Primitives x Objects
Unlike RegEx, other values like **Number**, **String** or **Boolean** have some issues when we want to retrieve their type when we use them as primitive or object (*wrapper*).
```js
typeof new Number(42) //'object' , create an object
typeof Number(42) //'number', create a primitive value
typeof 42 //'number'

666 instanceof Number //false
new Number(42) instanceof (666).constructor //true, because:
(666).constructor === Number.prototype.constructor
```
So, the previous example shows that it is possible to verify a primitive value with **typeof** and its wrapper with **instanceof** but we can't test both of them with the same method even if they share the same constructor. One method to deal with this problem would be to use **typeof value.valueOf()**.

### NaN
One of the most famous example in JavaScript is **NaN** (a.K.a *"Not a Number"*) which return a type of: **number**... 
```js
typeof NaN //'number' *sigh*
typeof new Number(NaN) //'object' *sigh* x 2
```

### Prototypes
As you may have noticed above, prototypes have a weird behavior. For example, the prototype of an Array is an empty Array, and it is the same thing with Number, String, Boolean... which store a default value (0,"",false). Therefore, we would expect them to be an instance of their own constructor. But, sadly, it is not the case... 
```js
Number.prototype instanceof Number //false
Number.prototype instanceof Number.prototype.constructor //false

//the best method so far to deal with it.
Object.prototype.toString.call(Number.prototype) //'[object Number]'
```

**And many more...** 

## why TypeOf-In help us:

TypeOf-In uses [typeof--](https://www.npmjs.com/package/typeof--) instead of **typeof** and **instanceof** to retrieve the type. **typeof--** extracts the constructor name or call *Object.prototype.toString* to get the type matching your value which allows this library to test all kinds of values accurately.
[Global Objects reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
> **TypeOf-In supports:**
> 
> - **Regex**
> 
> - **Multi choices**
> 
> - **primitive values and their respective wrapper return the same type**
> 
> - **NaN, undefined and null have their own types: #NaN, #Undefined and #Null**
> 
> - **it uses instanceof when necessary**
> 
> - **and more!**

[table of type returned by typeof-- (as string)](https://www.npmjs.com/package/typeof--#table-of-common-values)  

# Usage:
```js
    var typeOf = require('typeof-in'); 
```
## Through an object
### basic:
You can retrieve the type of your value as **string** by using **getType**
```js
typeOf('lollipop').getType(); //'String'
```
Or you can test your value with a **string** representing an expected type, or by using its **constructor**. For performance issues, you would prefer to use **strings** as much as you can, and also because only a few constructors are supported by all browsers (example: Promise, IndexedDB API...).
```js
//better performances, support multi-platform
typeOf('lollipop').In('String');             //'String' === 'String'
typeOf(new String('lollipop')).In('String'); //'String' === 'String'
typeOf(null).In('#Null');                    // '#Null' === '#Null'

//better readability, use instanceof when possible
typeOf('lollipop').In(String);             //'String' === 'String'
typeOf(new String('lollipop')).In(String); // x instanceof String
typeOf(null).In(null);                     // '#Null' === '#Null'
```

### multi:

It is also possible to compare your value with a set of different types by using an array.
```js
typeOf('lollipop').In([null, undefined, NaN, Number]); //false
```

### regex:
Furthermore, TypeOf-In also supports RegEx against your value, 

which is quite useful with [< #####Error >](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)  or  [< HTML##### >](https://developer.mozilla.org/en-US/docs/Web/API) types for example. 
```js
typeOf(new TypeError()).In(/.+Error$/); //all errors except 'Error'
typeOf(document.body).In(/^HTML.*/); //HTMLBodyElement [IE9+]
```

### ES6 and others objects:
This library can check all kind of objects. Allowing you to compare **ES6** features like Promises, Generators, fat arrows... which is pretty neat.
```js
typeOf(new Promise(function(){})).In(Promise) 
typeOf(()=>{}).In(Function)
typeOf(function*(){}).In('GeneratorFunction')
//or, if we want to use instanceof
var GeneratorFunction = (function*(){}).constructor
typeOf(function*(){}).In(GeneratorFunction)
```

### calling several times:
This is the main advantage of using TypeOf-In through an object, it allows you to deal with the same value in different ways
```js
var myType = typeOf('test');
if(myType.In(String)){
    //do something with the value as a string
}else if(myType.In([null,undefined])){
    //you need to init your value!
}else if(myType.In(/.+Error$/)){
    //something bad happened! but not a global error
}else if(myType.In(Error)){ 
    //is type 'Error'... 
}
```


### dealing with Objects:
This example shows different scenario where TypeOf-In will have a different behavior if the type is passed as a **string** or as a **constructor**.

**Important:** the library will not return an empty string("") but a "#Anonymous" type in the case of an instance of an anonymous constructor to improve readability. 
```js
	//use instanceof: return true
    typeOf({}).In(Object)
	typeOf({}).In({}) 
    typeOf([]).In(Object)
    typeOf([]).In(Array)    
    typeOf([]).In([])    
	typeOf(new TypeError()).In(Error)      
    typeOf(new TypeError()).In(TypeError)
    
    //use string comparison
    typeOf({}).In('Object') //true   
    typeOf([]).In('Object') //false
    typeOf([]).In('Array')  //true   
    typeOf(new TypeError()).In('TypeError')//true
    typeOf(new TypeError()).In('Error')    //false
        
    //more example ?
    
    function Human(){}; // ES6 equivalent: class Human {}
    var Person = Human;
    var Person2 = function Human(){};

    var person = new Person();
    var person1 = new Human();
    var person2 = new Person2();    
    
    typeOf(person).getType(); //'Human'
    typeOf(person2).getType(); //'Human'
    typeOf(person).In('Human'); //true
    typeOf(person2).In('Human'); //true
 
    //#instance against instance
    //if one of them has a valid constructor
    //use: x instanceof y.constructor; otherwise return false;
    typeOf(person).In(person1); //true 
    typeOf(person).In(person2); //false
        
    //#instance against constructor
    typeOf(person).In(Person); //true   
    typeOf(person).In(Human); //true   
    typeOf(person2).In(Human); //false    
    typeOf(person2).In(Object); //true
    
    
    //#special cases: instance of Anonymous (it behaves as the above examples)
    var AnonymousClass = function(){}, myAnonymous = new AnonymousClass();
    typeOf(myAnonymous).getType(); //return '#Anonymous'
    typeOf(myAnonymous).In('#Anonymous') //true
    typeOf(myAnonymous).In(AnonymousClass) //true    
    typeOf(myAnonymous).In(Object) //true   
```


## Through a function
(*decrease readability*)

The recent version of typeof-in allows you to directly call the function in charge of the comparison, and by extension, not create an object every time you use *typeOf()* in your code. 

This feature works exactly like the previous examples.

```js
//for comparison: with one argument (default behavior)
typeOfIn('lollipop').In([Number, [], 'String']); 

//with more than one argument:
var typeOfIn = typeOf;
typeOfIn('lollipop','String');
typeOfIn('lollipop',[Number, [], String]); 

//with zero argument : TypeOf-In expose getType() and In().
var typeOf = require('typeof-in')();
typeOf.getType('lollipop') //'String'
typoOf.In('lollipop',[Number, [], 'String']);
```

### force Object.prototype.toString
It is possible to force the use of *Object.prototype.toString* in typeof-- by adding the string **'forceObjectToString'** at the last parameter of the **In** and **getType** methods.
```js
typeOf(new TypeError(),'forceObjectToString').getType();
typeOf(new TypeError(),'forceObjectToString').In('Error');

var typeOfIn = typeOf;
typeOfIn(new TypeError(),'Error','forceObjectToString');

var typeOf = typeOf();
typeOf.getType(new TypeError(),'forceObjectToString');
typeOf.In(new TypeError(),'Error','forceObjectToString')
```

# with requireJS (AMD)

```js
/*
make sure to change the paths and module names according to your projects.
*/
require.config({
            baseUrl: "/",
            paths: {
                'typeof--':'./typeof--', //typeof-- directory path
                'typeOf':'./index' //TypeOf-In: index.js file path
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
In the case you only need the function used to retrieve the type of your values as a *string* (like **typeof**), you might be interested by using [typeof-- directly](https://www.npmjs.com/package/typeof--)

# NPM commands
> npm install typeof-in --save
>
> npm test
    
# About the environment
This library was created with **function.name** in mind, therefore, you will have better performances with recent version of your favorites browsers and servers (Node.JS V4...). 

Be careful with **[IE6-8]**, some objects has different behaviors (like arguments or document object).

Sorry for the capital letter in the **In()** method. **IE6** doesn't like when I use the **in** keyword in my code...

**you should consider using [lodash](https://lodash.com) before TypeOf-In, especially for simple cases**

Finally, I'm open to any suggestions
