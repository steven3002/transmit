import { useRoutes } from "react-router-dom";
import HomePage from "./components/pages/Home/HomePage";

export default function Routes() {
    return useRoutes([
        { path: "/", element: <HomePage /> },
        { path: "*", element: <div>Not Found</div> }
    ]);
};