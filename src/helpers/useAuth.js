import React, {createContext, useContext, useState, useEffect} from 'react';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import {useHistory, redirect, Redirect} from "react-router-dom";

const useImperativeQuery = (query) => {
    const { refetch } = useQuery(query, { skip: true });

    const imperativelyCallQuery = (variables) => {
        return refetch(variables);
    }

    return imperativelyCallQuery;
}

const sessionQuery = gql`
  {
    getSession
  }
`;

const sessionUserQuery = gql`
  query GetSessionUser($session: String!) {
    getSessionUser(session: $session) {
        _id
        firstName
        lastName
        email
        authType
    }
  }
`;

const destroySessionQuery = gql`
  query DestroySession($session: String!) {
    destroySession(session: $session)
  }
`;

const upsertUserMutation = gql`
  mutation upsertUser($input: UserInput!) {
      upsertUser(input: $input) {
        _id
        firstName
        lastName
        email
        authType
      }
  }
`;

const loginQuery = gql`
  query login($input: LoginInput!) {
    login(input: $input) {
      _id
      email
      firstName
      lastName
      authType
    } 
  }
`;

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext();

const useAuth = () => {
    return useContext(authContext);
}

const useProvideAuth = () => {
    const [user, setUser] = useState({});
    const [authenticated, setAuthenticated] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [sessionID, setSessionID] = useState(null);
    const getSession = useImperativeQuery(sessionQuery);
    const getLogin = useImperativeQuery(loginQuery);
    const getUser = useImperativeQuery(sessionUserQuery,{ errorPolicy: 'all' });
    const [destroySession] = useLazyQuery(destroySessionQuery);
    const [upsertUser, {data}] = useMutation(upsertUserMutation)

    const isAuthenticated = async (variables) => {
        const { data, error } = await getUser(variables)
        if (error) console.error(error)
        return data.getSessionUser
    }

    const getSessionPlease = async () => {
        const { data, error } = await getSession()
        if (error) console.error(error)
        return data.getSession
    }

    //const writeUserToAPISession

    //const writeUserToAPIDatabase

    const signup = (props) => {
        const input = { input: {} }
        input.input.firstName = props.firstName
        input.input.lastName = props.lastName
        input.input.email = props.email
        input.input.authType = props.authType
        input.input.password = props.password
        upsertUser({variables:input})
            .then(res => {
                console.log(res.data)
                // TODO complete signup process and make it tight :)
                //setAuthenticated(true)
                //setUser(res);
                //setRedirect("/dashboard")
            })
            .catch(e => {
                console.error(e)
            })
    }

    const signin = (username,password,setRedirect) => {
        if(username && password) {
            // 1: Verify username and password in API
            // 2: Authenticate user in API
            getLogin({
                    input: {
                        username: username,
                        password: password
                    }

            })
                .then(res => {
                    // 3: Set user data into API session, return to here
                    //console.log(res)
                    // 4: Set user data in React state and keep in sync with API
                    setUser(res.data.login);
                    setAuthenticated(true)
                    // 5: Redirect successful user to dashboard
                    setRedirect("/dashboard")
                })
            // 6: ERROR REPORTING!
        } else {
            console.error('Need username and password to login.')
        }
    };

    const googleSignin = (user, setRedirect) => {
        // First, always make sure the sessionID state is set by getting the sessionID from the API
        /*
        if(!sessionID) {
            getSessionPlease()
                .then(res => {
                    setSessionID(res)
                })
        }

         */
        if(user) {
            const input = {
                input: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    authType: user.authType,
                    // password: user.password
                }
            }
            upsertUser({variables: input })
                .then(res => {
                    setUser(res.data.upsertUser);
                    // Super basic, Google-only admin user
                    // @TODO better userTypes - on users in DB, all sign-in methods, etc.
                    if(user.email === "philgapp@gmail.com") {
                        setIsAdmin(true)
                    }
                    setRedirect("/dashboard")
                })
                .catch(e => {
                    console.error(e)
                })
        } else {
            console.error('Google login error.')
        }
    };

    const Signout = props => {
        const res = destroySession({
            variables: {
                session: sessionID
            }
        })
        setAuthenticated(false)
        setSessionID(null)
        setUser({})
    };

    useEffect( () => {
        try {
            if(!authenticated) {
                // Should we be authenticated? Check API session and user detail
                getSessionPlease()
                    .then(res => {
                        if(res) {
                            setSessionID(res)
                            isAuthenticated({ session: res }  )
                                .then(res => {
                                    if(res) {
                                        if(res._id !== null) {
                                            setUser(res)
                                            setAuthenticated(true)
                                        } else {
                                            setAuthenticated(false)
                                        }
                                    }
                                })

                        }
                    })
            }
        } catch(e) {
            console.error(e)
        }
    })

    return {
        user,
        sessionID,
        authenticated,
        isAdmin,
        signup,
        signin,
        googleSignin,
        Signout
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

export function SignoutButton(props) {
    const history = useHistory();
    const auth = useAuth();

    return auth.authenticated ? (
        <p>
            <button
                onClick={() => {
                    auth.Signout(() => history.push("/"));
                    props.setShowUserMenu(false)
                }}
            >
                Sign out
            </button>
        </p>
    ) : (
        <p>Sign In</p>
    );
}

export default useAuth

