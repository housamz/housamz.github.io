---
layout: post
title: How to code a simple calculator
category: Development
tags: [kids-coding, development, web]
---

Hello, everyone! Have you ever used a calculator before? It's a tool that helps you do math problems quickly and easily. You can use a calculator to add numbers together, subtract them, multiply them, and divide them.

Today, we're going to learn how to build our very own calculator using a programming language called `JavaScript`, a web page language called `HTML`, and a styling language called `CSS`.

HTML is like a skeleton or a structure for your web page. It's like the frame of a house. It tells the web browser what to put on the page, like buttons, text, and images.

JavaScript is like the brain of the web page. It's like a robot that can do things for you. In this case, it can add, subtract, multiply, and divide numbers for you when you press the buttons on the page.

CSS is like the clothes or the decoration for your web page. It's like the paint and wallpaper that make a house look nice. It tells the web browser how to make things look, like changing the color of the buttons or the font of the text.

So, in the example we created, the HTML code tells the web browser to create a calculator with buttons for numbers and operations. The JavaScript code tells the web browser how to perform calculations when you click the buttons. And the CSS code tells the web browser how to make the calculator look nicer.

Does that make sense to you?

First, let's start with the HTML. HTML is a language that helps us create the structure and content of a web page. Here's what the HTML code for our calculator looks like:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Calculator</title>
    <script src="calculator.js"></script>
  </head>
  <body>
    <h1>Simple Calculator</h1>
    <input type="text" id="result" disabled /><br /><br />

    <button onclick="clearResult()">C</button>
    <button onclick="deleteDigit()">Del</button>
    <button onclick="addOperator('%')">%</button>
    <button onclick="addOperator('/')">/</button><br />

    <button onclick="addDigit(7)">7</button>
    <button onclick="addDigit(8)">8</button>
    <button onclick="addDigit(9)">9</button>
    <button onclick="addOperator('*')">*</button><br />

    <button onclick="addDigit(4)">4</button>
    <button onclick="addDigit(5)">5</button>
    <button onclick="addDigit(6)">6</button>
    <button onclick="addOperator('-')">-</button><br />

    <button onclick="addDigit(1)">1</button>
    <button onclick="addDigit(2)">2</button>
    <button onclick="addDigit(3)">3</button>
    <button onclick="addOperator('+')">+</button><br />

    <button onclick="addDigit(0)">0</button>
    <button onclick="addDecimal()">.</button>
    <button onclick="calculate()">=</button>
  </body>
</html>
```

As you can see, the HTML code is a list of elements like headings, buttons, and input fields. We use the `<input>` tag to create a field that will display the result of our calculations. We also use the `<button>` tag to create buttons that we can click on to add numbers and operators to our calculations.

Now, let's move on to the JavaScript. JavaScript is a programming language that helps us make our web pages interactive. Here's the JavaScript code for our calculator:

```javascript
// These variables store the operator and the previous and current numbers.
let operator = "";
let prevNum = "";
let currNum = "";

// This function adds a digit to the current number and displays it in the result field.
function addDigit(num) {
  currNum += num;
  document.getElementById("result").value = currNum;
}

// This function adds a decimal point to the current number if it doesn't already contain one.
function addDecimal() {
  if (!currNum.includes(".")) {
    currNum += ".";
    document.getElementById("result").value = currNum;
  }
}

// This function adds the given operator to the calculation and calls the calculate function if there is already an operator.
function addOperator(op) {
  if (operator !== "") {
    calculate();
  }
  operator = op;
  prevNum = currNum;
  currNum = "";
}

// This function calculates the result of the expression based on the operator and previous and current numbers.
function calculate() {
  let result;
  const prev = parseFloat(prevNum);
  const curr = parseFloat(currNum);
  if (isNaN(prev) || isNaN(curr)) {
    return;
  }
  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = prev / curr;
      break;
    case "%":
      result = (prev / 100) * curr;
      break;
    default:
      return;
  }
  operator = "";
  prevNum = result.toString();
  currNum = "";
  document.getElementById("result").value = result;
}

// This function clears the operator and previous and current numbers, and clears the result field.
function clearResult() {
  operator = "";
  prevNum = "";
  currNum = "";
  document.getElementById("result").value = "";
}

// This function deletes the last digit from the current number and updates the result field.
function deleteDigit() {
  currNum = currNum.slice(0, -1);
  document.getElementById("result").value = currNum;
}
```

Now to make our calculator look more beautiful, we use a bit of CSS as below:
```css
body {
  font-family: Arial, sans-serif;
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
}

h2 {
  text-align: center;
}

#result {
  display: block;
  width: 215px;
  height: 50px;
  font-size: 24px;
  text-align: right;
  padding-right: 10px;
  margin-bottom: 10px;
}

button {
  cursor: pointer;
  width: 50px;
  height: 50px;
  font-size: 24px;
  border-radius: 5px;
  border: none;
  background-color: #f5f5f5;
  margin-right: 5px;
  margin-bottom: 5px;
}

button:hover {
  background-color: #e0e0e0;
}

button:active {
  background-color: #d0d0d0;
}

#zero {
  width: 110px;
}
```

You can see the code and the result on a website called CodePen where I put an example.

<iframe height="600" style="width: 100%;" scrolling="no" title="Simple Calculator" src="https://codepen.io/housamz/embed/XWPbKNw?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/housamz/pen/XWPbKNw">
  Simple Calculator</a> by Housamz (<a href="https://codepen.io/housamz">@housamz</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>