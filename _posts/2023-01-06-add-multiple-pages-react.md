---
layout: post
title: How To Add Multiple Pages in React (2023 Tutorial)
category: Development
tags: [development, react]
---

React is a popular JavaScript library used for building web applications. One of the essential features of a web application is the ability to navigate between different pages. In this tutorial, we will explore how to add multiple pages in a React application.

First, let's create a new React application using the Create React App command-line tool. Open your terminal and run the following command:

```bash
npx create-react-app my-app
```

This will create a new React application in the "my-app" directory.

Next, we need to install React Router, which is a popular library used for client-side routing. Open your terminal and run the following command:

```bash
npm install react-router-dom
```

Once the installation is complete, we can start creating multiple pages in our React application.

## Create a New Component for Each Page
The first step is to create a new component for each page in your application. Each component will represent a different page that the user can navigate to. For example, if you're building a blog, you might have a component for the homepage, a component for a single blog post, and a component for an about page.

Here's an example of what a basic page component might look like:

```javascript
import React from "react";

function HomePage() {
  return (
    <div>
      <h1>Welcome to my website</h1>
      <p>Here's some content for the homepage</p>
    </div>
  );
}

export default HomePage;
```

This component represents the homepage of your application. You can create additional components for each page in the same way.

## Set Up Routes
Now that we have our page components, we need to set up routes so that the user can navigate to each page. Open the "App.js" file and import the necessary components:

```javascript
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import BlogPostPage from "./BlogPostPage";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/blog/:id" component={BlogPostPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
```

In this example, we have set up routes for three different pages: the homepage, the about page, and a blog post page. The "exact" keyword is used to indicate that the path must match exactly for the homepage route.

We use the "Switch" component to ensure that only one route is matched at a time. The "Route" component is used to define each route and its corresponding component.

Add Navigation Links

Now that we have our routes set up, we need to add navigation links to our application. We can do this by using the "Link" component provided by React Router.

Here's an example of what the navigation links might look like:

```javascript
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
```

This component creates a navigation bar with links to the homepage and about page.

## Conclusion
In this tutorial, we have learned how to add multiple pages in a React application using React Router. We created a new component for each page, set up routes using the "Route" component, and added navigation links using the "Link" component provided by React Router. Now that you have a basic understanding of how to add multiple pages in a React application, you can start building more complex web applications with multiple pages and routes.

There are many other features and options available in React Router, such as passing parameters in the URL, redirecting to a different page, and using nested routes. The React Router documentation provides a detailed guide on how to use these features.

In addition to React Router, there are other libraries and tools available for client-side routing in React applications, such as Reach Router and Next.js. Each library has its own set of features and benefits, so it's important to research and choose the one that best fits your needs.

In conclusion, adding multiple pages in a React application is an essential part of building a web application. By following the steps outlined in this tutorial, you can start building web applications with multiple pages and routes. With the help of React Router and other libraries, you can create complex and interactive web applications that provide a seamless user experience.