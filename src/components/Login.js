import React, { useState } from 'react';
import useAuth from '../helpers/useAuth'
import GoogleLogin from 'react-google-login';
import { Redirect } from "react-router-dom";

const Login = props => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [redirect, setRedirect] = useState(null);
    const googleClientID = "536166203532-t30d4mei41eujd50df8e5brk4n0o8rn3.apps.googleusercontent.com"
    const googleClientSecret = "-Z3n4HIqUrNbPiUYwaqQZwAd"
    const auth = useAuth()

    const handleSubmit = event => {
        event.preventDefault()
        auth.signin(username,password,setRedirect)
    }

    const logGoogleRes = props => {
        console.log(props)
    }

    if(redirect) {
        return <Redirect to={redirect} />
    }
    return(
        <div className="loginForm">
            <h2 className={'f3 pl3'}>Please Sign In</h2>
            <GoogleLogin
                clientId={googleClientID}
                buttonText="Login with Google"
                onSuccess={logGoogleRes}
                onFailure={logGoogleRes}
                cookiePolicy={'single_host_origin'}
                className={'ma2 ml5'}
            />
            <form onSubmit={handleSubmit} className={'pa2 ml5'}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit" className={'pa2 mt3'}>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Login