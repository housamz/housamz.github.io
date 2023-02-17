---
layout: post
title: React Hooks
category: Development
tags: [react, development]
---

React Hooks were introduced in React 16.8 as a way to use state and other React features without writing class components. Since their introduction, hooks have become a fundamental part of React development, and learning how to use them is essential for any React developer. In this blog post, we'll explore React Hooks and show you how to use them with plenty of examples.

## What are React Hooks?
React Hooks are functions that allow you to use state and other React features without writing a class component. There are several built-in hooks in React, like `useState` and `useEffect`, and you can also create your own custom hooks.

Hooks allow you to use stateful logic and side effects in function components, making them more powerful and flexible. They also make it easier to share logic between components and reduce code duplication.

## Example 1: useState

The `useState` hook allows you to add state to a function component. Here's an example:

```javascript
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

In this example, we're using the `useState` hook to add a `count` state variable and a `setCount` function to update it. We're also using these values to update the UI when the user clicks the "Increment" button.

## Example 2: useEffect

The `useEffect` hook allows you to perform side effects, like fetching data or updating the DOM, in function components. Here's an example:

```javascript
import React, { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

In this example, we're using the `useEffect` hook to fetch data from an API and update the `users` state variable. We're also rendering the list of users in the UI.

The second argument of the `useEffect` hook is an array of dependencies. If any of the dependencies change, the hook will be re-run. In this example, we're passing an empty array, so the hook will only be run once, when the component is mounted.

## Example 3: useContext

The useContext hook allows you to access context values in function components. Here's an example:

```javascript
import React, { useContext } from "react";

const ThemeContext = React.createContext("light");

function ThemeToggle() {
  const theme = useContext(ThemeContext);

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
      >
        Toggle theme
      </button>
    </div>
  );
}
```

In this example, we're using the `useContext` hook to access the `theme` value from the `ThemeContext` and use it to update the UI when the user clicks the "Toggle theme" button.

## Example 4: useReducer

The `useReducer` hook allows you to manage complex state and update it with reducer functions, similar to how Redux works. Here's an example:

```javascript
import React, { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
    </div>
  );
}
```

In this example, we're using the `useReducer` hook to manage the `count` state variable and update it with the `reducer` function. We're also using the `dispatch` function to trigger the reducer function and update the state.

## Example 5: useRef

The `useRef` hook allows you to create a mutable value that persists across renders. Here's an example:

```javascript
import React, { useRef } from "react";

function TextInput() {
  const inputRef = useRef();

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

In this example, we're using the `useRef` hook to create a `inputRef` variable that stores a reference to the `input` element. We're also using the `focusInput` function to focus the input element when the user clicks the "Focus Input" button.

## Example 6: Custom Hook

In addition, you can also create your own custom hooks to encapsulate reusable stateful logic and share it across multiple components.

Here's an example of a custom hook that combines `useState` and `useEffect` to create a simple timer:

```javascript
import { useState, useEffect } from "react";

function useTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return count;
}

function Timer() {
  const count = useTimer();

  return <div>Count: {count}</div>;
}
```

In this example, we're using `useState` and `useEffect` to create a simple timer that increments every second. We're also using a custom hook called `useTimer` to encapsulate the stateful logic and share it across multiple components.

To use the `useTimer` custom hook in your React application, you can simply import it from the module where you defined it and use it in your component.

Here's an example:

```javascript
import React from "react";
import useTimer from "./useTimer";

function Timer() {
  const count = useTimer();

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
}

export default Timer;
```

In this example, we're importing the `useTimer` hook from the `./useTimer` module and using it in the `Timer` component. We're then rendering the current count value in a `p` tag.

When the `Timer` component mounts, the `useTimer` hook will initialize the count state to 0 and start a timer that increments the count every second. The component will re-render every time the count state changes, which will update the displayed count value.

You can use the `useTimer` hook in any component in your React application that needs to manage a timer or any other kind of stateful logic. By encapsulating the stateful logic in a custom hook, you can simplify your component code and make it more reusable.

There are several other React Hooks that you can explore, including:
* `useCallback`: This hook allows you to memoize a function and prevent unnecessary re-renders.
* `useMemo`: This hook allows you to memoize a value and prevent unnecessary re-calculations.
* `useImperativeHandle`: This hook allows you to customize the instance value that is exposed to parent components when using ref.
* `useLayoutEffect`: This hook is similar to useEffect, but it runs synchronously after all DOM mutations are applied.


In this blog post, we've explored several examples of React Hooks, including `useState`, `useEffect`, `useContext`, `useReducer`, `useRef`, and our custom hook. These hooks allow you to use stateful logic and side effects in function components, making them more powerful and flexible.  
I hope these examples help you get started with React Hooks and make your React development more efficient and enjoyable. React Hooks are a powerful and flexible feature that allow you to write more concise and readable code. By mastering these hooks and creating your own custom hooks, you can become a more efficient and effective React developer.