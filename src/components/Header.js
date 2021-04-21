import React from 'react';

const Header = (props) => {
    //const { header } = props;
    const header = {}
    header.title = "Sigma App"
    header.userOptions = ""
    return (
        <div className={"flex items-center justify-between Header w-100"}>
            <div className={"sigmaLogo"}>
                <p>&sigma;</p>
            </div>
            <div>
                <p>{header.title}</p>
            </div>
            <div className={"userSettings"}>
                <p>{"Phillip"}</p>
            </div>
        </div>
    );
};

export default Header;