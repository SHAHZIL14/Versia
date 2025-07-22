import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import authStore from "../store/authentication/authenticationStore";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
createRoot(document.getElementById("root")).render(
  <Provider store={authStore}>
      <App />
  </Provider>
);
