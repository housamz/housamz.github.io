---
layout: post
title: JavaScript shorthand to save time
category: Development
tags: [JavaScript, development]
---

As a JavaScript developer, you're probably always looking for ways to write code more efficiently and expressively. Fortunately, JavaScript provides many shorthand syntaxes that can help you do just that. By using these shorthands, you can write less code, improve readability, and make your code more concise and elegant.

In this blog post, we'll explore some of the most useful JavaScript shorthands, including shorthand assignments, arrow functions, destructuring, template literals, and more. We'll also provide plenty of examples and use cases for each shorthand so you can see how they can be used in practice.

Whether you're a beginner or an experienced JavaScript developer, this post will help you level up your coding skills and write better code. So let's get started and explore the wonderful world of JavaScript shorthands!

JavaScript has several shorthand syntaxes that can be used to write code more concisely. Here are some common examples:

1. **Ternary operator:** The ternary operator is a shorthand for an if-else statement. It takes three operands and returns one of two values based on a condition. Here's an example:

```javascript
// Instead of writing an if-else statement
let isEven = false;
if (num % 2 === 0) {
  isEven = true;
} else {
  isEven = false;
}

// You can use the ternary operator like this
let isEven = num % 2 === 0 ? true : false;
```

2. **Nullish coalescing operator:** The nullish coalescing operator (??) is a shorthand for checking if a value is null or undefined and returning a default value if it is. Here's an example:

```javascript
// Instead of writing an if statement to check for null or undefined
let username = "";
if (username === null || username === undefined) {
  username = "Guest";
}

// You can use the nullish coalescing operator like this
let username = username ?? "Guest";
```

3. **Optional chaining:** The optional chaining operator (?.) is a shorthand for checking if a property exists before accessing it. Here's an example:

```javascript
// Instead of writing an if statement to check if a property exists
if (person && person.address && person.address.city) {
  console.log(person.address.city);
}

// You can use the optional chaining operator like this
console.log(person?.address?.city);
```

4. **Arrow functions:** Arrow functions are a shorthand for writing function expressions. They have a concise syntax and do not require the function keyword. Here's an example:

```javascript
// Instead of writing a function expression like this
const square = function (num) {
  return num * num;
};

// You can use an arrow function like this
const square = (num) => num * num;
```

5. **Destructuring assignment:** Destructuring assignment is a shorthand for assigning values from an object or array to variables. Here's an example:

```javascript
// Instead of accessing object properties one by one
const person = { name: "John", age: 30 };
const name = person.name;
const age = person.age;

// You can use destructuring assignment like this
const { name, age } = person;
```

6. **Template literals:** Template literals are a shorthand for concatenating strings and variables. They use backticks (`) to enclose the string and ${} to insert variables. Here's an example:

```javascript
// Instead of concatenating strings and variables with the + operator
const name = "John";
const greeting = "Hello, " + name + "!";

// You can use template literals like this
const greeting = `Hello, ${name}!`;
```

7. **Default parameters:** Default parameters are a shorthand for providing default values to function parameters. If a parameter is not passed to the function, it will use the default value. Here's an example:

```javascript
// Instead of writing an if statement to check for undefined parameters
function greet(name) {
  if (name === undefined) {
    name = "Guest";
  }
  console.log(`Hello, ${name}!`);
}

// You can use default parameters like this
function greet(name = "Guest") {
  console.log(`Hello, ${name}!`);
}
```

8. **Spread operator:** The spread operator is a shorthand for expanding an array or object into individual elements. It uses the ... syntax. Here's an example:

```javascript
// Instead of using a loop to copy an array
const arr1 = [1, 2, 3];
const arr2 = [];
for (let i = 0; i < arr1.length; i++) {
  arr2.push(arr1[i]);
}

// You can use the spread operator like this
const arr2 = [...arr1];
```

9. **Object property shorthand:** Object property shorthand is a shorthand for creating objects with properties that have the same name as the variable. Here's an example:

```javascript
// Instead of writing out the property name and variable name
const name = "John";
const age = 30;
const person = { name: name, age: age };

// You can use object property shorthand like this
const person = { name, age };
```

10. **Short-circuit evaluation with && and ||:** The && and || operators can be used for short-circuit evaluation, which means that the second operand is only evaluated if necessary. For example, expr1 && expr2 returns expr1 if it is falsy, otherwise it returns expr2. Similarly, expr1 || expr2 returns expr1 if it is truthy, otherwise it returns expr2.

```javascript
const name = "John";
const message = name || "Anonymous";
console.log(message); // Output: "John"

const age = 18;
const isAdult = age >= 18 && true;
console.log(isAdult); // Output: true
```
11. **The += and -= operators:** The += and -= operators are shorthand for adding or subtracting a value to a variable and assigning the result to the variable.

```javascript
let x = 2;
x += 3; // same as x = x + 3
console.log(x); // Output: 5

let y = 10;
y -= 5; // same as y = y - 5
console.log(y); // Output: 5
```

12. **The spread operator:** The spread operator allows an expression to be expanded in places where multiple arguments or elements are expected. It can be used to merge arrays, clone arrays, or convert an iterable object to an array.

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [...arr1, ...arr2];
console.log(arr3); // Output: [1, 2, 3, 4, 5, 6]

const arr4 = [...arr1];
console.log(arr4); // Output: [1, 2, 3]

function sum(...nums) {
  return nums.reduce((total, num) => total + num);
}
console.log(sum(1, 2, 3, 4, 5)); // Output: 15
```

## JavaScript array methods:

1. map: The map method creates a new array by applying a function to each element of an existing array.

```javascript
const arr1 = [1, 2, 3];
const arr2 = arr1.map((num) => num * 2);
console.log(arr2); // Output: [2, 4, 6]
```
2. filter: The filter method creates a new array with only the elements that pass a test specified by a function.

```javascript
const arr1 = [1, 2, 3, 4, 5];
const arr2 = arr1.filter((num) => num % 2 === 0);
console.log(arr2); // Output: [2, 4]
```

3. reduce: The reduce method reduces an array to a single value by applying a function to each element and accumulating the result.

```javascript
const arr1 = [1, 2, 3, 4, 5];
const sum = arr1.reduce((accumulator, currentValue) => accumulator + currentValue);
console.log(sum); // Output: 15
```

4. forEach: The forEach method executes a function for each element in an array.

```javascript
const arr1 = [1, 2, 3];
arr1.forEach((num) => console.log(num));
// Output:
// 1
// 2
// 3
```

5. sort: The sort method sorts the elements of an array in place and returns the sorted array.

```javascript
const arr1 = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const arr2 = arr1.sort();
console.log(arr2); // Output: [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]
```

6. some: The some method tests whether at least one element in the array passes the test specified by a function.

```javascript
const arr1 = [1, 2, 3, 4, 5];
const result = arr1.some((num) => num % 2 === 0);
console.log(result); // Output: true
```

7. every: The every method tests whether all elements in the array pass the test specified by a function.

```javascript
const arr1 = [2, 4, 6, 8, 10];
const result = arr1.every((num) => num % 2 === 0);
console.log(result); // Output: true
```
