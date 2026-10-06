import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {App} from "@src/react/App";
import {createStore} from "@src/redux/Store";
import "@src/index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The page has no #root element to mount the app in.");
}

const store = createStore();

createRoot(root).render(
  <StrictMode>
    <App store={store} />
  </StrictMode>,
);
