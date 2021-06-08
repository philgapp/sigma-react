import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePopper } from "react-popper";
import '../styles/popper.css';

/*
Popup functional component creates tooltips, inputDropdowns, and modal popups. Built on usePopper React hook.

Inputs
popupId - default "temptempPopupId", expects a string to use for the component ID
-- in parent component use like: const [ popupTrigger, setPopupTrigger ] = useState()
type - default "tooltip", expects string "tooltip", "modal", or "inputDropdown"
triggerType - default "mouseover" for tooltips, expects string "mouseover" or "refInputData"
arrow - Ref element, defaults to null, expects state object from parent component (see setArrow)
setArrow - useState function from parent component to set the Ref for the arrow element
-- use like: const [ arrowElement, setArrowElement ] = useState()
content - too many types of tooltip, dropdown, or modal content (string, JSX, forms, etc. etc.)
setInputData - parent component data processing function, for example to set a controlled input value, most often for inputDropdowns
options - defaults to null, usePopper option config object

Returns
Logical functionality for inputDropdowns, modals, tooltips and related event listeners.
JSX for the appropriate DOM elements
 */
const Popup = (
    {   popupId = "tempPopupId",
        type = "tooltip",
        triggerType = "mouseover",
        trigger = null,
        arrow = null,
        setArrow = null,
        content,
        setInputData,
        options = null }) => {

    // Local state
    // The popup element is built within the return JSX
    const [ popupEl, setPopupEl ] = useState()

    // Refs
    // - for storing most recent state data for inputDropdown
    const dropdownContentRef = useRef()
    const listElementRef = useRef()
    // - to track keyboard event listener to maintain a single instance
    const isKeyboardListenerActive = useRef(false)


    // Main Functionality
    // Call usePopper hook to create our popup
    const { styles, attributes, update } = usePopper( trigger, popupEl, options );


    // Memoize
    // - functions for showing and hiding the popup, for both useEffect and button actions
    const { showPopup, hidePopup } = useMemo(() => {

        // function to hide popup if click outside of popupEl, used in event listeners in showPopup and hidePopup
        const hidePopupIfExternalClick = (e) => {
            e = e || window.event
            if (e.target !== popupEl && !popupEl.contains(e.target) ) {
                e.preventDefault()
                hidePopup() }
        }

        // Show the popup
        const showPopup = () => {
            if( popupEl ) {
                popupEl.setAttribute('data-show', '');
                if( type === "modal" ) {
                    popupEl.closest(".popupBackdrop").setAttribute('data-show', '');
                    window.addEventListener('click', hidePopupIfExternalClick, false) }
            }
        }

        // Hide the popup
        const hidePopup = () => {
            if( popupEl ) {
                popupEl.removeAttribute('data-show');
                if( type === "modal" ) {
                    popupEl.closest(".popupBackdrop").removeAttribute('data-show');
                    window.removeEventListener('click', hidePopupIfExternalClick, true)
                    window.removeEventListener('click', hidePopupIfExternalClick, false) }
            }
        }

        // Return memoized functions and end the useMemo hook function
        return { showPopup, hidePopup } },[ type, popupEl ] )


    // Event Functions
    // - Selecting child elements of type "inputDropdown" popups
    // - keydown 'tab' or 'return'
    const selectDropdownElement = () => {
        if( listElementRef.current ) {
            setInputData( { name:"_id", value: listElementRef.current.getAttribute( 'id' ) } )
            trigger.value = ( listElementRef.current.textContent || listElementRef.current.innerText )
            hidePopup()
        } else {
            return
        }
    }
    // - Highlighting element in a populated, visible inputDropdown popup
    // - keydown up and down arrows
    const highlightDropdownElement = ( keyAction ) => {
        const rawSymbols = dropdownContentRef.current.props.children
        const symbols = rawSymbols.map( ( element ) => {
            return { symbol: element.props.children, id: element.props.id, selected: false }
        } )
        if( symbols.length === 1 ) {
            listElementRef.current = document.getElementById( dropdownContentRef.current.props.children[0].props.id )
            listElementRef.current.setAttribute( 'selected', "" )
        } else if ( symbols.length > 1 ) {

            const selectedElement = symbols.filter( ( symbol ) => {
                console.log(symbol)
                return symbol.selected === true
            })

            if( keyAction === "downArrow" ) {
                if( selectedElement.length > 0 ) {
                    console.log( selectedElement )
                } else {
                    listElementRef.current = document.getElementById( dropdownContentRef.current.props.children[0].props.id )
                    listElementRef.current.setAttribute( 'selected', "" )
                }

            }
            if( keyAction === "upArrow" ) {

            }
        }
    }
    // Process keyboard input for type "inputDropdown" popups
    // - calls selectDropdownElement or highlightDropdownElement functions as appropriate
    const processKeyboardInput = (e) => {
        if( !isKeyboardListenerActive.current ) {
            window.removeEventListener('keydown', processKeyboardInput )
            if( e ) {
                e.stopImmediatePropagation()
                e.preventDefault() }
            dropdownContentRef.current = []
            return
        }
        const keyCode = e.keyCode
        const possibleTargets = {
            downArrow: 40,
            upArrow: 38,
            enter: 13,
            tab: 9
        }
        const validKey = Object.values( possibleTargets )
            .includes( keyCode )
            ? keyCode
            : false
        if( validKey !== false ) {
            e.preventDefault()
            switch ( validKey ) {
                // @TODO allow keyboard and mouse selection of dropdown elements!
                case 40:
                    highlightDropdownElement('downArrow')
                    break
                case 38:
                    highlightDropdownElement('upArrow')
                    break
                case 13:
                    selectDropdownElement('enter')
                    break
                case 9:
                    selectDropdownElement('tab')
                    break
                default:
                    return
            }
        }
    }

    // Primary side-effect functionality
    useEffect(() => {

        // If any props change and usePopper has initialized, update the Popper instance
        if( update ) update()

        // "mouseover" triggerType and "tooltip" type defaults
        // - set mouse event listeners to show and hide the tooltip
        if( typeof popupEl !== "undefined" ) {
            if ( triggerType === "mouseover" ) {
                if (type === "tooltip") {
                    const currentClasses = trigger.getAttribute('class')
                    trigger.setAttribute('class', currentClasses + ' trigger')

                    trigger.addEventListener('mouseover', showPopup, false)
                    trigger.addEventListener('mouseout', hidePopup, false)
                }
            }
        }

    },[ type, trigger, triggerType, popupEl, arrow, options, update, showPopup, hidePopup ] )

    // "refInputData" and "inputDropdown" side effects
    useEffect( () => {
        // Show dropdown with valid content and after 250ms after last input onchange
        // Hide dropdown when no valid content
        // @TODO OR when dropdown selection is made
        if( triggerType === "refInputData" && type === "inputDropdown" ) {
            dropdownContentRef.current = content

            if ( content.props ) {
                showPopup()
                if (type === "inputDropdown" && !isKeyboardListenerActive.current) {
                    setTimeout(() => {
                        window.addEventListener('keydown', processKeyboardInput )
                        isKeyboardListenerActive.current = true
                    }, 250)
                }
            } else {
                hidePopup()
                if( isKeyboardListenerActive.current ) {
                    isKeyboardListenerActive.current = false
                    processKeyboardInput() }
            }
        }
    }, [ content, showPopup, hidePopup ] )


    return (
        <div
            className={ type === "modal" ? "popupBackdrop" : "popupContainer" } >
            <div
                id={ popupId }
                ref={ setPopupEl }
                className={ "popup" }
                style={ styles.popper }
                {...attributes.popper} >
                { content }

                { type === "modal" &&
                    <button
                        id={"closeModal"}
                        onClick={hidePopup}
                        className={"pa1"} >
                        Close </button> }

                { arrow &&
                    <div
                        className={ "arrow" }
                        ref={ setArrow }
                        style={ styles.arrow } /> }

            </div>
        </div>
    )
}

export default Popup