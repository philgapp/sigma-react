import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Redirect,
} from "react-router-dom";
import '../styles/App.css';
import useAuth, {
    ProvideAuth,
}  from '../helpers/useAuth'
import Login from './Login'
import Header from './Header';
import Dashboard from './Dashboard';
import Options from './Options';
import Underlying from './Underlying';
import AroiCalculator from './AroiCalculator';
import useOptionForm from '../helpers/useOptionForm'
//import AddItem from './AddItem'


function App() {

    // addOption Form State Hook
    const {
        showOptionForm,
        optionFormButtonText,
        showForm
    } = useOptionForm()

    return (
        <ProvideAuth>
            <Router>
                <div className={"App flex flex-column"}>
                    <Header />

                <Switch>
                    <PrivateRoute path="/aroi">
                        <AroiCalculator />
                    </PrivateRoute>
                    <PrivateRoute path="/options">
                        <Options
                            showForm={showForm}
                            showOptionForm={showOptionForm}
                            optionFormButtonText={optionFormButtonText}
                        />
                    </PrivateRoute>
                    <PrivateRoute path="/underlying">
                        <Underlying />
                    </PrivateRoute>
                    <PrivateRoute path="/dashboard">
                        <Dashboard
                            showForm={showForm}
                            showOptionForm={showOptionForm}
                            optionFormButtonText={optionFormButtonText}
                        />
                    </PrivateRoute>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/">
                        <Login />
                    </Route>
                    <Route path="*">
                        <NoMatch />
                    </Route>
                </Switch>

                </div>
            </Router>
        </ProvideAuth>
    );
}

function PrivateRoute({ children, ...rest }) {
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.authenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

function NoMatch() {
    const location = useLocation();

    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}

export default App;