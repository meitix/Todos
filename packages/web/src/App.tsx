import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, Login, Register } from "./modules/auth";
import { Layout } from "./modules/layout";
import { Auth } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
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
