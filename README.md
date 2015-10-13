# TypeOf-In
allows your values to be compared with a set of **Constructors** or **Strings** representing the expected type. 

compatible with **IE6+**

best performances on browsers/servers supporting ES6: Function.name

#Foretaste:
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
**\[fun fact\]** *Object.prototype* has the same behavior as *null* with *typeof* and *instanceof*

### RegEx
Using a regular expression literal, someone would expect **typeof** to return a specific value like **"regexp"**, but it's not the case. (it's not a primitive value but a literal...)
```js
typeof /regularExpression/ // 'object'
/regularExpression/ instanceof RegExp // true
```
### Primitives x Objects
Unlike RegEx, other values like **Number**, **String** or **Boolean** have some issues when we want to retrieve their type when we use them as primitive or object (*wrapper*).
```js
typeof new Number(42) //'object'
typeof Number(42) //'number'
typeof 42 //'number'

666 instanceof Number //false
new Number(42) instanceof (666).constructor //true, because:
(666).constructor === Number.prototype.constructor
```
So, the previous example shows that it is possible to verify a primitive value with **typeof** and its wrapper with **instanceof** but we can't test both of them with the same method even if they share the same constructor. One method to deal with this problem would be to use **typeof value.valueOf()**.

### NaN
One of the most famous example in JavaScript is **NaN** (a.K.a *"Not a Number"*) which return a type of: **number**... \* sigh \*
```js
typeof NaN //'number'
typeof new Number(NaN) //'object'
```

### prototypes
As you may have noticed above, prototypes have a weird behavior. For example, the prototype of an Array is an empty Array, and it is the same thing with Number, String, Boolean... which store a default value (0,"",false). Therefore, we would expect them to be an instance of their own constructor. But, sadly, it is not the case... 
```js
Number.prototype instanceof Number //false
Number.prototype instanceof Number.prototype.constructor //false

//the best method so far to deal with it.
Object.prototype.toString.call(Number.prototype) //'[object Number]'
```

**And many more...** 

## why TypeOf-In help us:

TypeOf-In uses [typeof--](https://www.npmjs.com/package/typeof--) instead of **typeof** and **instanceof** to retrieve the type. **typeof--** extracts the constructor name or call *Object.prototype.toString* to get the type matching your value which allows this library to test primitive value, Global Object and custom one.
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

[table of type returned by typeof-- (as string)](https://www.npmjs.com/package/typeof--#tables-of-common-values)  

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
Or you can test your value with a **string** representing an expected type, or by using its **constructor (or literal value)**. For performance issues, you would prefer to use **strings** as much as you can. 
```js
//better performances, multi-platform
typeOf('lollipop').In('String');             //'String' === 'String'
typeOf(new String('lollipop')).In('String'); //'String' === 'String'
typeOf(null).In('#Null');                    // '#Null' === '#Null'

//better readability, use instanceof when possible
typeOf('lollipop').In(String);             //'String' === 'String'
typeOf(new String('lollipop')).In(String); // x instanceof String
typeOf(null).In(null);                     // '#Null' === '#Null'
```
(**important:** some constructors are not supported by all browsers)

### multi:

You might also want to compare your value with a set of different types.
```js
//using an Array (improve performances)
typeOf('lollipop').In([null, undefined, NaN, Number]); //false

//or with multiple arguments
typeOf('lollipop').In(null, undefined, NaN, Number);
```

### regex:
Furthermore, TypeOf-In also supports RegEx against your value, 

which is quite useful with < ****Error> types for example. [about Errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
```js
typeOf(new TypeError()).In(/.+Error$/); //not a Global Error
```

### ES6 and others objects:
This library can check all kind of objects. Allowing you to compare **ES6** features like Promises, Generators, fat arrows... which is pretty neat.
```js
typeOf(new Promise(function(){}).In(Promise) 
typeOf(()=>{}).In(Function)
typeOf(function*(){}).In('GeneratorFunction')
//or
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
	//use instanceof
    typeOf({}).In(Object) //true
    typeOf({}).In({}) //true
    typeOf([]).In(Object)   //true
    typeOf([]).In(Array)    //true
    typeOf([]).In([])    //true
	typeOf(new TypeError()).In(Error)      //true
    typeOf(new TypeError()).In(TypeError)  //true
    
    //use simple comparison of type
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
 
    //#instance against instance
    //if one of them has a valid constructor
    //use: x instanceof y.constructor; otherwise return false;
    typeOf(person).In(person1); //true 
    typeOf(person).In(person2); //false
        
    //#instance against constructor
    typeOf(person).In(Person); //true   
    typeOf(person).In(Human); //true
    typeOf(person).In('Human'); //true
    
    typeOf(person2).In(Human); //false    
    typeOf(person2).In(Object); //true
    typeOf(person2).In('Human'); //true
    typeOf(person2).In('Object'); //false
    
    
    //#special cases: instance of Anonymous (it behaves as the above examples)
    var AnonymousClass = function(){}, myAnonymous = new AnonymousClass();
    typeOf(myAnonymous).getType(); //return '#Anonymous'
    typeOf(myAnonymous).In('#Anonymous') //true
    typeOf(myAnonymous).In(AnonymousClass) //true    
    typeOf(myAnonymous).In(Object) //true   
```


## Through a function
(*decrease readability*)

The recent version of typeof-in (>= 3.0.0) allows you to directly call the function in charge of the comparison, and by extension, not create an object every time you use *typeOf()* in your code. 

This feature works exactly like the previous examples.

```js
//for comparison: with one argument (default behavior)
typeOfIn('lollipop').In([Number, [], 'String']); 

//with more than one argument:
var typeOfIn = typeOf;
typeOfIn('lollipop','String');
typeOfIn('lollipop',Number, [], String); 
typeOfIn('lollipop',[Number, [], String]); 

//with zero argument : TypeOf-In expose getType() and In().
var typeOf = require('typeof-in')();
typeOf.getType('lollipop') //'String'
typoOf.In('lollipop',Number, [], 'String');
typoOf.In('lollipop',[Number, [], 'String']);
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
This library was created with **Node.JS V4** in mind. Therefore, this library will use ES6 features as soon as *Node.JS* supports [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) 

Sorry for the capital letter in the **In()** method. **IE6** doesn't like when I use the **in** keyword...

**you should consider using [lodash](https://lodash.com) before TypeOf-In, especially for simple cases**

Finally, I'm open to any suggestions
