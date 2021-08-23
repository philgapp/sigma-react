import React, { useState } from 'react';
import useAuth, { SignoutButton } from '../helpers/useAuth'
import { Link } from "react-router-dom";

const Header = (props) => {
    //const { header } = props;
    const header = {}
    const [showUserMenu, setShowUserMenu] = useState(false)
    header.title = "Sigma App"
    const auth = useAuth()
    const firstName = auth.authenticated ? auth.user.firstName : ""

    const toggleUserMenu = props => {
        props.e.preventDefault()
        props.showUserMenu === false ? setShowUserMenu(true) : setShowUserMenu(false)
    }

    return (
        <>
            <div className={"Header"} id={"Header"}>
                <div className={"flex w-100"}>

                    <div className={"flex w-75 fl"}>
                        <div className={"sigmaLogo w-25"}>
                            <p>&sigma;</p>
                        </div>
                        <div className={"title"}>
                            <p>{header.title}</p>
                        </div>
                    </div>

                    {auth.authenticated &&
                    <div className={"w-25 fr"}>
                        <div className={"userSettings self-start"}>
                            <button className={"userButton"}
                               onClick={(e) => toggleUserMenu({e, showUserMenu: showUserMenu})}>
                                {firstName || ""}
                            </button>
                        </div>
                    </div>
                    }

                <div className={"cf"}></div>

                </div>

                {auth.authenticated &&
                <nav className={"mt2 mb2"}>
                    <ul className={"flex list"}>
                        {auth.isAdmin &&
                        <li className={'pa2 dashboardIcon'}>
                            <Link to={'/members'}>Members</Link>
                        </li>
                        }
                        <li className={'pa2 dashboardIcon'}>
                            <Link to={'/dashboard'}>Dashboard</Link>
                        </li>
                        <li className={'pa2 optionIcon'}>
                            <Link to={'/options'}>Options</Link>
                        </li>
                        <li className={'pa2 underlyingIcon'}>
                            <Link to={'/underlying'}>Underlying</Link>
                        </li>
                        <li className={'pa2 aroiIcon'}>
                            <Link to={'/aroi'}>AROI Calc</Link>
                        </li>
                    </ul>
                </nav>
                }
            </div>

            {(showUserMenu && auth.authenticated) &&
            <div className={"userMenu"}>
                <p>
                    <button
                        onClick={(e) => {
                           e.preventDefault();
                        }}
                    >
                        Profile Settings
                    </button>
                </p>
                <SignoutButton setShowUserMenu={setShowUserMenu} />
            </div>
            }

        </>
    );
};

export default Header;