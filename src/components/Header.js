import React from 'react';
import useAuth, { AuthButton } from '../helpers/useAuth'
import {Link} from "react-router-dom";

const Header = (props) => {
    //const { header } = props;
    const header = {}
    header.title = "Sigma App"
    header.userOptions = ""
    const auth = useAuth()
    const signedIn = auth.authenticated
    const firstName = signedIn ? auth.user.firstName : ""

    const sessionID = auth.sessionID ? "sessionID set" : false
    return (
        <>
            <div className={"flex Header w-100"}>
                <div className={"sigmaLogo"}>
                    <p>&sigma;</p>
                </div>
                <div className={"title"}>
                    <p>{header.title}</p>
                </div>
                <div className={"userSettings fr"}>
                    <p>{firstName || ""}</p>
                    <AuthButton />
                </div>
            </div>
            {signedIn &&
            <nav className={"mt2 mb2"}>
                <ul className={"flex list"}>
                    <li className={'pa2 dashboardIcon'}>
                        <Link to={'/dashboard'}>Dashboard </Link>
                    </li>
                    <li className={'pa2 aroiIcon'}>
                        <Link to={'/aroi'}>AROI Calc</Link>
                    </li>
                    <li className={'pa2 optionIcon'}>
                        <Link to={'/options'}>Options</Link>
                    </li>
                    <li className={'pa2 underlyingIcon'}>
                        <Link to={'/underlying'}>Underlying</Link>
                    </li>
                </ul>
            </nav>
            }
        </>
    );
};

export default Header;