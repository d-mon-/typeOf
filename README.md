# Typeof-in ( + instanceof )
allow you to compare the type (or instance) of your value with several types (or constructor), and finally return a **Boolean**.

## Why use typeof-in ? 
#### It supports:
- Regex
- Multi choices
- both: new String('test') and 'test' return the same type (String) 
- it handles NaN, Undefined, Null types
- use instanceof when necessary: typeOf(instance).in(constructor)
- and more!

In some ways, it is the fusion of **typeof** and **instanceof**

#### You can check the following types:
> - Boolean / String / Number / Symbol 
>
> - NaN / Undefined / Null
>
> - Function / GeneratorFunction / Iterator / Promise
>
> - Error / TypeError / ...
>
> - HTMLDocument / ...
>
> - RegExp
>
> - Array / ArrayBuffer / UInt32Array / (Weak)Map / (Weak)Set / ...
>
> - built-in Objects in general (even those that do not exist yet)
>
>   and many more... (in fact, you can check almost everything)

[built-in Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)

## Use cases:
```js
    const typeOf = require('typeof-in'); 
```
#### Through an object
###### basic:
You can retrieve the type or compare it with a string representing an expecting type.
```js
typeOf('test').getType(); //return 'String' (see 'typeOf only' below);

//return a Boolean, in these cases: true.
typeOf('lolipop').in('String');
typeOf(null).in('Null');
typeOf(undefined).in('Undefined');
typeOf(NaN).in('NaN');
```
Concerning NaN values:
```js
//do not use instanceof:
typeOf(NaN).in('NaN'); //true
typeOf(NaN).in('Number'); //false
typeOf(NaN).in(Number); //false 
typeOf(new Number(NaN)).in('NaN'); //true
typeOf(new Number(NaN)).in('Number'); //false

//use instanceof:
typeOf(new Number(NaN)).in(Number); //true
typeOf(new Number(NaN)).in(Object); //true
```

###### multi:

You might also want to compare your value with a set of different types.

```js
//using an Array (better performance)
typeOf('lolipop').in(['Number', 'String', 'Object','Array']);
//or multiple arguments
typeOf('lolipop').in('Number', 'String', 'Object', 'Array');
```

###### regex:
Furthermore, typeof-in also supports Regex against your value, which is quite useful with < ****Error> types for example. [about Error types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
```js
typeOf(new TypeError()).in(/.+Error$/); //is an error other than 'Error' type
```

###### ES6 and others objects:
This library can check all kind of objects. Allowing you to compare *ES6* features like Promises, Generators, fat arrows... which is pretty neat.
```js
typeOf(new Promise(function(){}).in('Promise')
typeOf(function*(){}).in('GeneratorFunction')
typeOf(()=>{}).in('Function')
```

###### calling several times:
This is the main advantage of using typeof-in through an object, it allows you to hit the same value in different ways
```js
//call the "in" method several times
if(myType.in('String')){
    //do something with value as a string
}else if(myType.in(['Null','Undefined'])){
    //you need to init your value!
}else if(myType.in(/.+Error$/)){
    //something bad happened! but not a global error
}else if(myType.in(Error)){
    //global error handler... :(
}
```

###### some other tricks:
*it might impact performance*

In some case, especially when the initial value passed in typeOf is not an Object, typeof-in will try to retrieve the constructor name (as a string) passed in its **in()** method when necessary. 

```js
//with contructors
typeOf('lolipop').in([Number,String,Promise,Boolean,GeneratorFunction,Iterator,Function,Array,Error,Object,Symbol])

//with random values, however: strings and arrays must absolutely be empty! ('' & [])
typeOf(1).in([null,undefined,NaN,[], {}, 42,'',function*(){}, function hi(){console.log('hellow world')}]); 
//is equal to
typeOf(1).in(['Null','Undefined','NaN','Array','Object','Number',GeneratorFunction','Function'])
```

###### dealing with instanceof:
The following examples show different cases when typeof-in will use instanceof to compare the value with the constructor of a prototype.

However, the library will not return an empty string('') but a "#Anonymous" value in the case of an instance of an anonymous prototype. 
```js
    typeOf(new String('test')).in(String)
    typeOf({}).in(Object)
    typeOf([]).in(Object) //return true! you might want to use a string 'Array'
    
    //OR

    function Human(){}; // ES6: class Human {}
    var Person = Human;
    var Person2 = function Human(){};

    var person = new Person();
    var _person = new Person();
    var __person = new Human();
    var person2 = new Person2();  
    
    //#instance against instance
    typeOf(person).in(_person); //true
    typeOf(person).in(__person); //true    
    typeOf(person).in(person2); //false
    
    //#instance against prototype
    typeOf(person).in(Person); //true   
    typeOf(person).in(Human); //true
    typeOf(person2).in(Human); //false
    typeOf(person2).in('Human'); //true
    typeOf(person2).in(Object); //true
    typeOf(person2).in('Object'); //true
    
    typeOf(person).getType(); // return 'Human'
    typeOf(person2).getType(); //return 'Human'
    typeOf(new(function $(){})).getType(); //return '$'
    typeOf(new(function _(){})).getType(); //return '_'
    
    //#special cases: instance of Anonymous (it behaves like examples above)
    var myAnonymous = function(){};
    typeOf(new(function (){})).getType(); //return '#Anonymous'
    typeOf(new (myAnonymous)).in('#Anonymous') //true
    typeOf(new (myAnonymous)).in(myAnonymous) //true
    typeOf(new (myAnonymous)).in(Object) //true
    typeOf(new (myAnonymous)).in(new(function(){})) //false
    
```


#### Through a function
*improve performance (unique call), decrease readability*

The recent version of typeof-in (>= 3.0.0) allows you to directly call the function in charge of the comparison, and by extension, not create an object every time you use typeOf() in your code. 

This feature works exactly like the previous examples. however, you cannot retrieve the type.

```js
typeOf('lolipop','String'); 
typeOf('lolipop',Number, [], 'String'); 
typeOf('lolipop',[Number, [], 'String']);
```

#### TypeOf only
In the case you only need the function used to retrieve the type (as a String) of a specific value, you can directly require the file typeOf.js as shown below.
```js
const typeOf = require('typeof-in/typeOf'); //typeOf.js
typeOf(true) === 'Boolean'
typeOf(person1) === 'Personnage'
typeOf(function*(){}) === 'GeneratorFunction'

switch(typeOf('test')){
    case 'String':
    case 'Number':
    default:
}
//and so on...
```



## NPM commands

#### install
> npm install typeof-in --save

#### main test
> npm test

#### test of index.js
> npm run typein-test

#### test of typeOf.js
> npm run type-test

#### *words of advice*

_index.js_ : *ES6*  (for..of , const and let) => use babel if necessary

you might need to polyfill Object.getPrototypeOf() for cross-browser compatibility

_typeOf.js_ : *ES5*
 
    
Finally, I'm open to any suggestions
