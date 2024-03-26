import {BrowserRouter as Router} from "react-router-dom";
import Routes from "./route";

export default function App() {
    return (
        <div className="max-h-screen">
            <Router>
                <Routes/>
            </Router>
        </div>
    );
}