import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Authenticated, AuthProvider, Login, Register } from "./modules/auth";
import { Layout } from "./modules/layout";
import { Auth, Todos } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Authenticated>
        <Layout />
      </Authenticated>
    ),
    children: [
      {
        path: "",
        element: <Todos />,
      },
    ],
  },
  {
    path: "auth",
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
