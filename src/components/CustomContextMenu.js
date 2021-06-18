import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";
import { usePopper } from "react-popper";
import '../styles/popper.css';
//import Table from "./Table";

const CustomContextMenu = (
    {
        menuType = "SIMPLE",
        type = "option",
        actions = null,
        elementId = null,
        archiveText,
        setArchiveText
    }) => {

    // TODO break this out into useArchive or something similar - along with form below under 'delete' case
    const itemId = useRef('')
    const archiveTextRef = useRef('')


    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(<p></p>);
    const [modal, setModal] = useState(null);
    const [referenceEl, setReferenceEl] = useState(null)
    const { styles, attributes, update } = usePopper(referenceEl, modal);

    useEffect(() => {

        if(update) update()

        /*
        const virtualReference = {
            getBoundingClientRect() {
                return {
                    top: 172,
                    left: 0,
                    bottom: 0,
                    right: 100,
                    width: 0,
                    height: 0,
                };
            },
        };
        setReferenceEl(virtualReference)

         */

    },[modal, archiveText, modalContent, elementId, update])


    useEffect(() => {
        archiveTextRef.current = archiveText
    },[archiveText])

    const hideModalFunction = useCallback( ( e ) => {
        e = e || window.event
        if (e.target !== modal && !modal.contains(e.target) ) {
            e.preventDefault()
            hideModal()
        }
    }, [ modal ] )

    const hideModal= useCallback( () => {

        const hideModalIfExternalClick = hideModalFunction

        // Hide the tooltip
        modal.removeAttribute('data-show');
        modal.closest(".tooltipBackdrop").removeAttribute('data-show');
        //setIsModalOpen(false)
        window.removeEventListener('click', hideModalIfExternalClick, true)
        window.removeEventListener('click', hideModalIfExternalClick, false)


    }, [ modal, hideModalFunction ] )

    function showModal() {

        const hideModalIfExternalClick = hideModalFunction

        // Make the tooltip visible
        if(update) update()
        modal.setAttribute('data-show', '');
        modal.closest(".tooltipBackdrop").setAttribute('data-show', '');
        //setIsModalOpen(true)
        window.addEventListener('click', hideModalIfExternalClick, false)
    }

    const archive = useMemo(() => (archiveKey) => (event) => {
        event.preventDefault()
        event.stopPropagation()
        const id = itemId.current
        const text = archiveTextRef.current[archiveKey]

        if(id && text) {
            if(text === "ARCHIVE") {
                alert("Fake archived: " + id)
                setArchiveText({ key: archiveKey, value: "" })
                itemId.current = ""
                hideModal()
            } else {
                alert("Please type 'ARCHIVE' in all caps to delete this record.")
            }
        } else {
            console.error("No ID and/or 'ARCHIVE' provided.")
        }
    },[ setArchiveText, hideModal ])

    const ArchiveInput = ({ value, onChange, id }) => {
        return (
            <input
                type={"text"}
                id={id}
                key={id}
                className={"mt3"}
                //value={value}
                onChange={onChange}
            />
        )
    }

    const handleClick = (e, data) => {
        e.preventDefault()
        e.stopPropagation()
        //isModalOpen ? hideModal() : setIsModalOpen(true)
        setReferenceEl(data.target.closest('tr'))
        const id = data.element.optionId
        itemId.current = id
        const clickAction = data.action
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
                const archiveInputId = "archiveInput_" + id
                setModalContent(
                    <form onSubmit={archive(archiveInputId)} id={archiveInputId} key={archiveInputId}>
                        <p>Archive {id} - (note, this functionality is still in development)</p>

                        <label id={"delete_" + id} className={"mt3"}>
                            <p className={"required"}>
                                Type 'ARCHIVE' to soft-delete this item.
                            </p>
                            <ArchiveInput
                                onChange={e => setArchiveText({ key: archiveInputId, value: e.target.value })}
                                id={archiveInputId + "-input"}
                            />
                        </label>

                        <span className={"clear"}></span>
                        <button type={"submit"} className={"archiveSubmit pa1"}>
                            Archive
                        </button>
                    </form>
                )
                break
            default:
                setModalContent(
                    <p>No content provided.</p>
                )
        }
        showModal()
    }

    return (
        <>
            { type === "option" &&
            <tr key={"customContextMenu"} className={"invisibleRow"}>
                <td key={"customContextMenu"} className={"invisibleCell"}>
            <ContextMenu className={type} id={elementId}>
                <MenuItem onClick={ handleClick } data={{ action: "edit" }}>
                    Edit</MenuItem>
                <MenuItem onClick={ handleClick } data={{ action: "close" }}>
                    Close</MenuItem>
                <MenuItem onClick={ handleClick } data={{ action: "delete" }}>
                    Archive</MenuItem>
            </ContextMenu>

            <div className={"tooltipBackdrop"} key={"tooltipBackdrop"}>
                <div
                    id={elementId}
                    key={elementId}
                    ref={setModal}
                    className={"tooltip"}
                    style={styles.popper}
                    {...attributes.popper} >
                    <div className={"pa2"} key={elementId + "modal"}>
                        {modalContent}
                        <button id={"closeModal"} onClick={hideModal} className={"pa1"}>
                            Close</button>
                    </div>
                </div>
            </div>
                </td>
            </tr>
            }
        </>
    );

}

export default CustomContextMenu