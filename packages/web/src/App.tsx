import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, Login } from "./modules/auth";
import { Auth } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Todo page!</h1>,
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Login /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
