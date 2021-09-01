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

// 2
const httpLink = createHttpLink({
    uri: process.env.API_URL + ':' + process.env.PORT + '/graphql',
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