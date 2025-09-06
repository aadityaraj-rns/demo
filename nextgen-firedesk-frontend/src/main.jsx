import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Spinner from "./pages/admin/spinner/Spinner";
import "./_mockApis";
import "./utils/i18n";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/Store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Spinner />} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
