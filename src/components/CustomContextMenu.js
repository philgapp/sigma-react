import React, {useEffect, useState} from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";
import { usePopper } from "react-popper";
import '../styles/popper.css';

const CustomContextMenu = (props) => {
    const menuType = "SIMPLE"
    const type = props.type || "option"
    const actions = props.actions || null

    const handleClick = (e, data) => {
        e.preventDefault()
        e.stopPropagation()
        const clickAction = data.action
        const id = data.id
        switch (clickAction) {
            // TODO import and setModalContent form 'fragments' per case
            case "edit":
                setModalContent(
                    <p>Edit {id}</p>
                )
                break
            case "close":
                setModalContent(
                    <p>Close {id}</p>
                )
                break
            case "delete":
                setModalContent(
                    <p>Delete {id}</p>
                )
                break
        }
        showModal()
    }

    const referenceElement = {
        getBoundingClientRect() {
            return {
                top: 10,
                left: 10,
            };
        },
    };

    const [modal, setModal] = useState(null);
    const [referenceEl, setReferenceEl] = useState(null)
    const [modalContent, setModalContent] = useState(<p></p>);
    const { styles, attributes, update } = usePopper(referenceEl, modal);

    function showModal() {
        // Make the tooltip visible
        modal.setAttribute('data-show', '');
    }

    function hideModal() {
        // Hide the tooltip
        modal.removeAttribute('data-show');
    }

    useEffect(() => {
        setReferenceEl(document.getElementById("Header"))
        if(update) update()
    },[modal])

    return (
        <>
            {type === "option" &&
            <>
            <ContextMenu className={type} id={menuType}>
                <MenuItem onClick={handleClick} data={{action:"edit"}}>Edit</MenuItem>
                <MenuItem onClick={handleClick} data={{action:"close"}}>Close</MenuItem>
                <MenuItem onClick={handleClick} data={{action:"delete"}}>Delete</MenuItem>
            </ContextMenu>

                <div id={"tooltip"} ref={setModal} className={""} style={styles.popper} {...attributes.popper}>
                    <div className={"pa2"}>
                        {modalContent}
                        <button id={"closeModal"} onClick={hideModal} className={"fr pa1 mt3 mb2"}>Close Popup</button>
                    </div>
                </div>
            </>
            }
        </>
    );

}

export default CustomContextMenu