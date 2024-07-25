import { createBrowserRouter } from "react-router-dom";
import App2 from "./views/App2";
import App1 from "./views/App1";
import App3 from "./views/App3";

const NotFoundPage = () => <h1>404 Not Found</h1>;

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App2/>
    },
    {
        path: "/app2",
        element: <App2/>
    },
    {
        path: "/app1",
        element: <App1/>
    },
    {
        path: "*",
        element: <NotFoundPage/>
    },
    {
        path: "/app3",
        element: <App3/>
    },
]);
