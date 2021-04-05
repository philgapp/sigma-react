import React, { Component } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import '../styles/App.css';

class App extends Component {
    render() {
        return (
            <div className={"App flex flex-column"}>
                <Header />
                <Dashboard />
            </div>
        );
    }
}

export default App;
