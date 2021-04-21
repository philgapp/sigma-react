import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Link
} from "react-router-dom";
import '../styles/App.css';
import Header from './Header';
import Dashboard from './Dashboard';
import Options from './Options';
import AroiCalculator from './AroiCalculator';
import AddItem from './AddItem'

function App() {
        return (
            <Router>
                <div className={"App flex flex-column"}>
                    <Header />
                    <nav>
                        <ul className={"flex list"}>
                            <li className={'pa2'}>
                                <Link to={'/'}>Dashboard </Link>
                            </li>
                            <li className={'pa2'}>
                                <Link to={'/aroi'}>AROI Calc</Link>
                            </li>
                            <li className={'pa2'}>
                                <Link to={'/options'}>Options</Link>
                            </li>
                        </ul>
                    </nav>

                    <AddItem />

                <Switch>
                    <Route path="/aroi">
                        <AroiCalculator />
                    </Route>
                    <Route path="/options">
                        <Options />
                    </Route>
                    <Route path="/">
                        <Dashboard />
                    </Route>
                    <Route path="*">
                        <NoMatch />
                    </Route>
                </Switch>

                </div>
            </Router>
        );
}

function NoMatch() {
    let location = useLocation();

    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}

export default App;
