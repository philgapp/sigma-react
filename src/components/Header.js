import React from 'react';

const Header = (props) => {
    //const { header } = props;
    const header = {}
    header.logo = ""
    header.title = "Sigma App"
    header.userOptions = ""
    return (
        <div>
            <div className={header}>
                <h1>&sigma;</h1>
                <h2>{header.title}</h2>

            </div>
        </div>
    );
};

export default Header;