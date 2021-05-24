import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import useAuth from '../helpers/useAuth'
import GoogleLogin from 'react-google-login';
import { Redirect } from "react-router-dom";

const processGoogleMutation = gql`
  mutation processGoogleAuth($input: GoogleAuth!) {
      processGoogleAuth(input: $input) {
            _id
            firstName
            lastName
            email
            authType
      }
  }`;

const Login = props => {
    const auth = useAuth()
    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [authType, setAuthType] = useState("Local");
    const [signupForm, setSignupForm] = useState(false)
    const [redirect, setRedirect] = useState(null);
    const [runGoogleAuthMutation] = useMutation(processGoogleMutation)
    // TODO ENV VAR!!!
    const googleClientID = "536166203532-t30d4mei41eujd50df8e5brk4n0o8rn3.apps.googleusercontent.com"

    const toggleSignupForm = props => {
        props.e.preventDefault()
        props.signupForm === false ? setSignupForm(true) : setSignupForm(false)
    }

    const handleLogin = event => {
        event.preventDefault()
        auth.signin(username,password,setRedirect)
    }

    const handleSignup = event => {
        event.preventDefault()
        auth.signup({email,firstName,lastName,password,authType,setRedirect})
    }

    const processGoogleSuccess = props => {
        const variables = {
            input: {
                token: props.tokenId
            }
        }
        runGoogleAuthMutation({ variables: variables })
            .then(res => {
                if(res.data.processGoogleAuth) {
                    const googleUser = res.data.processGoogleAuth
                    auth.googleSignin(googleUser, setRedirect)
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }

    const processGoogleError = props => {
        // TODO this better
        console.error(props)
    }

    if(redirect) {
        return <Redirect to={redirect} />
    } else if (auth.authenticated) {
        return <Redirect to={"/dashboard"} />
    }

    return(
        <>
        {auth.authenticated === false &&
            <div className="loginForm">
                <h2 className={'f3 pl3'}>Please Sign In</h2>
                <GoogleLogin
                    clientId={googleClientID}
                    buttonText="Login with Google"
                    onSuccess={processGoogleSuccess}
                    onFailure={processGoogleError}
                    cookiePolicy={'single_host_origin'}
                    className={'ma2 ml5'}
                />
                <form onSubmit={handleLogin} className={'pa2 ml5'}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setUserName(e.target.value)}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setPassword(e.target.value)}/>
                    </label>
                    <div>
                        <button type="submit" className={'pa2 mt3'}>Login</button>
                    </div>
                </form>
                <p className={"ml5 mt2"}>No account? No problem.</p>
                <p className={"ml5 mt2"}>Create one by logging in with Google above or
                    <button className={"ml1 pa2 b"} onClick={e => toggleSignupForm({e,signupForm:signupForm})}>Signup Now!</button>
                </p>
                {signupForm &&
                    <form onSubmit={handleSignup} className={'pa2 ml5'}>
                        <label>
                            <p>Email (also Username)</p>
                            <input type="text" onChange={e => setEmail(e.target.value)}/>
                        </label>
                        <label>
                            <p>First Name</p>
                            <input type="text" onChange={e => setFirstName(e.target.value)}/>
                        </label>
                        <label>
                            <p>Last Name</p>
                            <input type="text" onChange={e => setLastName(e.target.value)}/>
                        </label>
                        <label>
                            <p>Password</p>
                            <input type="password" onChange={e => setPassword(e.target.value)}/>
                        </label>
                        <input type={"hidden"} name={"authType"} value={"Local"} />
                        <div>
                            <button type="submit" className={'pa2 mt3'}>Sign Up</button>
                        </div>
                    </form>
                }
            </div>
        }

        </>
    )
}

export default Login