import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

// 1
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from '@apollo/client';

console.log(process.env)

// 2
const httpLink = createHttpLink({
    uri: process.env.REACT_APP_API_URL,
    // @TODO make this an ENV variable and prep dev vs. prod envs!
    credentials: 'include'
});

// 3
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

// 4
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
serviceWorker.unregister();