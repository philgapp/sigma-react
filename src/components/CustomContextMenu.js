import React from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";

const CustomContextMenu = (props) => {
    const menuType = "SIMPLE"
    const type = props.type || "option"
    const actions = props.actions || null

    const handleClick = (e, data) => {
        e.preventDefault()
        const clickAction = data.action
        const id = data.id
        switch (clickAction) {
            case "edit":
                console.log("edit " + id)
                break
            case "close":
                console.log("close " + id)
                break
            case "delete":
                console.log("delete " + id)
                break
        }
    }

    return (
        <>
            {type === "option" &&
            <ContextMenu className={type} id={menuType}>
                <MenuItem onClick={handleClick} data={{action:"edit"}}>Edit</MenuItem>
                <MenuItem onClick={handleClick} data={{action:"close"}}>Close</MenuItem>
                <MenuItem onClick={handleClick} data={{action:"delete"}}>Delete</MenuItem>
            </ContextMenu>
            }
        </>
    );

}

export default CustomContextMenu