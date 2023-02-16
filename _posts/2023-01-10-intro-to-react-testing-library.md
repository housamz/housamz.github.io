---
layout: post
title: Introduction to React Testing Library
category: Development
tags: [development, react, software-testing]
---

React is one of the most popular front-end libraries used for building web applications. It offers a lot of features, including virtual DOM, component-based architecture, and unidirectional data flow. However, testing React applications can be a bit challenging because of the dynamic nature of the library.

React Testing Library is a library that helps in testing React applications by focusing on what the user sees and does, instead of testing the implementation details of the application. In this blog post, we will explore the React Testing Library and how it can be used to test React applications.

## Setting up React Testing Library

To use the React Testing Library, we need to install it first. We can do this by running the following command:

```bash
npm install --save-dev @testing-library/react
```

This will install the React Testing Library as a development dependency in our project. We can then import the library in our test files like this:

```javascript
import { render, screen } from "@testing-library/react";
```

The `render` function is used to render a React component and returns a container object that we can use to interact with the rendered component. The `screen` object provides various functions that allow us to find elements in the rendered component.

## Writing tests using React Testing Library

### Testing a simple React component

Let's say we have a simple React component that displays a button and a message. We want to test that clicking the button updates the message correctly. Here is the code for the component:

```javascript
import React, { useState } from "react";

function MyComponent() {
  const [message, setMessage] = useState("Initial message");

  function handleClick() {
    setMessage("New message");
  }

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <p>{message}</p>
    </div>
  );
}
```

To test this component using React Testing Library, we can create a test file and write the following test:

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "./MyComponent";

test("updates message on button click", () => {
  render(<MyComponent />);
  const button = screen.getByText("Click me");
  fireEvent.click(button);
  const message = screen.getByText("New message");
  expect(message).toBeInTheDocument();
});
```

In this test, we use the `render` function to render the `MyComponent` component. We then use the `screen` object to find the button element by its text and simulate a click event using the `fireEvent` function. Finally, we use the `screen` object again to find the message element by its text and assert that it is in the document using the `toBeInTheDocument` function.

### Testing a Form Submission

Let's say we have a simple React component that displays a form with an input field and a submit button. We want to test that filling out the form and submitting it calls the appropriate function with the input value. Here is the code for the component:

```javascript
import React, { useState } from "react";

function MyForm({ onSubmit }) {
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(inputValue);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input value:
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

To test this component using React Testing Library, we can create a test file and write the following test:

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import MyForm from "./MyForm";

test("calls onSubmit with input value on form submit", () => {
  const mockSubmit = jest.fn();
  render(<MyForm onSubmit={mockSubmit} />);
  const input = screen.getByLabelText("Input value:");
  const submitButton = screen.getByText("Submit");
  fireEvent.change(input, { target: { value: "test value" } });
  fireEvent.click(submitButton);
  expect(mockSubmit).toHaveBeenCalledWith("test value");
});
```

In this test, we use the `render` function to render the `MyForm` component with a mock `onSubmit` function. We then use the `screen` object to find the input and submit button elements by their text and label. We simulate a change event on the input field to set its value to "test value", and then we simulate a click event on the submit button. Finally, we use the `toHaveBeenCalledWith` function to assert that the `onSubmit` function was called with the input value.

### Testing a Component that Uses a Custom Hook

Let's say we have a React component that uses a custom hook to fetch some data from an API and display it. We want to test that the component displays the data correctly when the hook returns it. Here is the code for the component and the custom hook:

```javascript
import React from "react";
import useData from "./useData";

function MyComponent() {
  const { isLoading, data } = useData();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
}

export default MyComponent;
```

```javascript
import { useState, useEffect } from "react";

function useData() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://my-api.com/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, []);

  return { isLoading, data };
}

export default useData;
```

To test this component using React Testing Library, we can create a test file and write the following test:

```javascript
import { render, screen } from "@testing-library/react";
import useData from "./useData";
import MyComponent from "./MyComponent";

jest.mock("./useData");

test("displays data when loaded", () => {
  useData.mockReturnValue({
    isLoading: false,
    data: [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ],
  });
  render(<MyComponent />);
  const item1 = screen.getByText("Item 1");
  const item2 = screen.getByText("Item 2");
  expect(item1).toBeInTheDocument();
  expect(item2).toBeInTheDocument();
});
```
In this test, we use the `jest.mock` function to mock the `useData` hook and return some sample data. We then use the `render` function to render the `MyComponent` component, and we use the `screen` object to find the elements that should contain the data. Finally, we use the `toBeInTheDocument` function to assert that the elements are present in the document.

### Testing a Component that Uses React Router
Let's say we have a React component that uses React Router to display different content based on the URL. We want to test that the component renders the correct content for each URL. Here is the code for the component:

```javascript
import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

function MyRouter() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/about">
          <p>About content</p>
        </Route>
        <Route path="/">
          <p>Home content</p>
        </Route>
      </Switch>
    </div>
  );
}

export default MyRouter;
```

To test this component using React Testing Library, we can create a test file and write the following test:

```javascript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyRouter from './MyRouter';

test('renders home content for the home URL', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <MyRouter />
    </MemoryRouter>
  );
  const homeContent = screen.getByText('Home content');
  expect(homeContent).toBeInTheDocument();
});

test('renders about content for the about URL', () => {
  render(
    <MemoryRouter initialEntries={['/about']}>
      <MyRouter />
    </MemoryRouter>
  );
  const aboutContent = screen.getByText('About content');
  expect(aboutContent).toBeInTheDocument();
});
```

In these tests, we use the `MemoryRouter` component from React Router to simulate different URLs. We use the `initialEntries` prop to set the initial URL to either "/" or "/about". We then use the `render` function to render the `MyRouter` component inside the `MemoryRouter`. Finally, we use the `screen` object to find the elements that should contain the content for each URL, and we use the `toBeInTheDocument` function to assert that the elements are present in the document.

## Conclusion
React Testing Library is a powerful tool that can help us test React applications more efficiently. By focusing on the user's perspective, we can write tests that are more resilient to changes in the implementation details of our application. We can use the library to test various aspects of our application, including user interactions, state changes, and component rendering. With the examples above, you can get started with React Testing Library and start writing efficient tests for your React applications.
