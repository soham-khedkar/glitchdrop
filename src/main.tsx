import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.tsx";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import Home from "./components/Home.tsx";
import MainPage from "./components/MainPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/fileexchange" element={<MainPage />} />
    </Route>
  )
);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <KindeProvider
        clientId="943a0c6673954decbbf41a3e8c80c1f6"
        domain="https://codecrush.kinde.com"
        redirectUri="http://localhost:5173"
        logoutUri="http://localhost:5173"
      >
        <RouterProvider router={router} />
      </KindeProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
