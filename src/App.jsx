import "./index.css";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import Home from "./components/Home";
import AddPost from "./components/Add Post/AddPost";
import Authentication from "./components/Authentication";
import About from "./components/About";
import AuthLayout from "../layout/AuthLayout";
import Verification from "./verification/Verification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";;
import ProfilePage, { userInfoLoader } from "./components/profile/ProfilePage";
import Card from "./components/PostCard/Card";
import { postInfoLoader } from "./components/PostCard/Card";
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
            { path: "/home", element: <Home /> },
            { path: "/add-post", element: <AddPost /> },
          ],
        },
        { path: "/about", element: <About /> },
        { path: "/verify", element: <Verification /> },
        { path: "/auth", element: <Authentication /> },
        { path: "*", element: <Navigate to="/" /> },
      ],
    },
    {
      path: "/profile",
      element: <ProfilePage mode={"current"} />,
    },
    {
      path: "/user/:userId",
      element: <ProfilePage mode={"public"} />,
      loader: userInfoLoader,
    },
    {
      path: "/user/:userId/post/:postId",
      element: <Card data={null} mode={"specific"} />,
      loader: postInfoLoader,
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
