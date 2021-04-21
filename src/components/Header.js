import React from 'react';
import useAuth, { AuthButton } from '../helpers/useAuth'
import {Link} from "react-router-dom";

const Header = (props) => {
    //const { header } = props;
    const header = {}
    header.title = "Sigma App"
    header.userOptions = ""
    const auth = useAuth()
    const signedIn = auth.user
    return (
        <>
            <div className={"flex items-center justify-between Header w-100"}>
                <div className={"sigmaLogo"}>
                    <p>&sigma;</p>
                    <p>{header.title}</p>
                </div>
                <div className={"userSettings"}>
                    <p>{auth.user || ""}</p>
                    {signedIn &&
                    <AuthButton />
                    }
                </div>
            </div>
            {signedIn &&
            <nav>
                <ul className={"flex list"}>
                    <li className={'pa2'}>
                        <Link to={'/dashboard'}>Dashboard </Link>
                    </li>
                    <li className={'pa2'}>
                        <Link to={'/aroi'}>AROI Calc</Link>
                    </li>
                    <li className={'pa2'}>
                        <Link to={'/options'}>Options</Link>
                    </li>
                </ul>
            </nav>
            }
        </>
    );
};

export default Header;