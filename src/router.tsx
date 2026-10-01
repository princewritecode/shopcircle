import Body from "./components/Body";
import { createBrowserRouter } from "react-router";
import App from "./App";
import Error from "./components/ErrorElement";
import Contact from "./components/Contact";
export const appLayout = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <Body></Body>,
      },
      {
        path: "contact",
        element: <Contact></Contact>,
      },
    ],
  },
]);
