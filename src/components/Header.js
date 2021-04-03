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
                {header.title}
            </div>
        </div>
    );
};

export default Header;