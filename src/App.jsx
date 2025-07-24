import "./index.css";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import Home from "./components/Home";
import Authentication from "./components/Authentication";
import About from "./components/About";
import AuthLayout from "../layout/AuthLayout";
import Verification from "./verification/Verification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import postServices from "../services/Post";
import { addBatch } from "../store/Post/PostSlice";
function App() {
  const refresh = useSelector((state) => state.refresh);
  const dispatch = useDispatch();
  const fetchPosts = async (cursorDocumentID) => {
    const post = (await postServices.getPostBatch(cursorDocumentID)).documents;
    const metaPost = await postServices.getMetaPostBatch(post);
    const POST = post.map((post) => {
      const meta = metaPost.documents.find((m) => m.postId == post.$id);
      return {
        data:post ,
        metaData: meta || {},
      };
    });
    dispatch(addBatch(POST));
    return;
  };
  useEffect(() => {
    fetchPosts();
  }, [refresh]);
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
          ],
        },
        { path: "/about", element: <About /> },
        { path: "/verify", element: <Verification /> },
        { path: "/auth", element: <Authentication /> },
        { path: "*", element: <Navigate to="/" /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
