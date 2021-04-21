import React, {createContext, useContext, useState} from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {useHistory, Redirect} from "react-router-dom";

const loginQuery = gql`
  {
    getLogin(user:$user) {
      _id
      symbol
      user {
        email
      }
      spreads {
        legs {
          qty
          entryDate
          strike
          expirationDate
          initialAroi
          notes
        }
      }
  } 
  }
`;

const fakeAuth = {
    isAuthenticated: false,
    signin(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext();

const useAuth = () => {
    return useContext(authContext);
}

const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const history = useHistory();

    const signin = (username,password,setRedirect) => {
        if(username && password) {
            setUser(username);
            setRedirect("/dashboard")
        } else {
            console.error('Need username and password to login.')
        }
    };

    const signout = props => {
        setUser(null);
    };

    return {
        user,
        signin,
        signout
    };
}

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

export function AuthButton() {
    const history = useHistory();
    const auth = useAuth();

    return auth.user ? (
        <p>
            <button
                onClick={() => {
                    auth.signout(() => history.push("/"));
                }}
            >
                Sign out
            </button>
        </p>
    ) : (
        <p></p>
    );
}

export default useAuth

