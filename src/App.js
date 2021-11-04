import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/dashboard" component={Dashboard} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;