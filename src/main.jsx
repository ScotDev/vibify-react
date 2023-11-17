import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import AuthProvider from "./context/AuthProvider";

import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { loader as profileLoader } from "./routes/profile";

import RootRoute from "./routes/root";
import ProfileRoute from "./routes/profile";
import ErrorPage from "./error-page";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AuthRoute from "./routes/AuthRoute.jsx";
import Profile from "./pages/Profile.jsx";
import Step1 from "./pages/Step1.jsx";
import Step2 from "./pages/Step2.jsx";
import Step3 from "./pages/Step3.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: (
          <div>
            <h1>Hello from About</h1>
            <Link to="/">Home</Link>
          </div>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AuthRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/profile",
        element: <ProfileRoute />,
        // loader: profileLoader,
        children: [
          {
            path: "/profile",
            element: <Profile />,
            loader: profileLoader,
          },
        ],
      },
      {
        path: "/step-1",
        element: <Step1 />,
      },
      {
        path: "/step-2",
        element: <Step2 />,
      },
      {
        path: "/step-3",
        element: <Step3 />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </AuthProvider>
  </React.StrictMode>
);

// App.propTypes = {
//   children: PropTypes.node.isRequired,
// };
