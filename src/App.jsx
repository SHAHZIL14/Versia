import "./index.css";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import Authentication from "./components/Authentication";
import AuthLayout from "../layout/AuthLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: "",
          element: <ProtectedRoute />,
          children: [
            { index: true, element: <Navigate to="/home" /> },
            {
              path: "/home",
              lazy: async () => {
                const { default: Component } = await import("./components/Home");
                return { Component };
              },
            },
            {
              path: "/add-post",
              lazy: async () => {
                const { default: Component } = await import("./components/Add Post/AddPost");
                return { Component };
              },
            },
          ],
        },
        {
          path: "/about",
          lazy: async () => {
            const { default: Component } = await import("./components/About");
            return { Component };
          },
        },
        {
          path: "/verify",
          lazy: async () => {
            const { default: Component } = await import("./verification/Verification");
            return { Component };
          },
        },
        { path: "/auth", element: <Authentication /> },
        { path: "*", element: <Navigate to="/" /> },
      ],
    },
    {
      path: "/profile",
      lazy: async () => {
        const { default: Component } = await import("./components/profile/ProfilePage");
        return { Component: () => <Component mode={"current"} /> };
      },
    },
    {
      path: "/user/:userId",
      lazy: async () => {
        const { default: Component, userInfoLoader } = await import("./components/profile/ProfilePage");
        return { Component: () => <Component mode={"public"} />, loader: userInfoLoader };
      },
    },
    {
      path: "/user/:userId/post/:postId",
      lazy: async () => {
        const { default: Component, postInfoLoader } = await import("./components/PostCard/Card");
        return { Component: () => <Component data={null} mode={"specific"} />, loader: postInfoLoader };
      },
    },
  ]);

  return (
    <>
      <RouterProvider
        router={router}
        fallbackElement={<p className="text-center mt-10">Loading...</p>}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
