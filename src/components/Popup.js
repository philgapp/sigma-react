import React, { useState, useEffect, useMemo } from 'react';
import { usePopper } from "react-popper";
import '../styles/popper.css';

const Popup = ({popupId, type = "modal", triggerType, trigger, arrow, setArrow, content, options}) => {

    // The popup element is built within the return JSX
    const [popupEl, setPopupEl] = useState()

    // Call usePopper hook to create our popup
    const { styles, attributes, update } = usePopper(trigger, popupEl, options);

    // Memoize functions for showing and hiding the popup, for both useEffect and button actions
    const { showPopup, hidePopup } = useMemo(() => {

        // function to hide popup if click outside of popupEl, used in event listeners in showPopup and hidePopup
        const hidePopupIfExternalClick = (e) => {
            e = e || window.event
            if (e.target !== popupEl && !popupEl.contains(e.target) ) {
                e.preventDefault()
                hidePopup()
            }
        }

        // Show the popup
        const showPopup = () => {
            if(popupEl) {
                popupEl.setAttribute('data-show', '');
                if(type === "modal") {
                    popupEl.closest(".popupBackdrop").setAttribute('data-show', '');
                    window.addEventListener('click', hidePopupIfExternalClick, false)
                }
            }
        }

        // Hide the popup
        const hidePopup = () => {
            if(popupEl) {
                popupEl.removeAttribute('data-show');
                if(type === "modal") {
                    popupEl.closest(".popupBackdrop").removeAttribute('data-show');
                    window.removeEventListener('click', hidePopupIfExternalClick, true)
                    window.removeEventListener('click', hidePopupIfExternalClick, false)
                }
            }
        }

        return { showPopup, hidePopup }

    },[type, popupEl])

    // Master side-effect functionality
    useEffect(() => {

        // By default for mouseover triggerType and tooltip type, set mouse event listeners to show and hide the tooltip
        if(typeof popupEl !== "undefined") {
            if(triggerType === "mouseover") {
                if(type === "tooltip") {
                    trigger.addEventListener('mouseover', showPopup, false)
                    trigger.addEventListener('mouseout', hidePopup, false)
                    const currentClasses = trigger.getAttribute('class')
                    trigger.setAttribute('class',currentClasses +' trigger')
                }
            }
        }

        // If any props change and usePopper has initialized, update the Popper instance
        if(update) update()

    },[type, trigger, triggerType, popupEl, content, options, update, showPopup, hidePopup])

    return (
        <div
            className={type === "modal" ? "popupBackdrop" : "popupContainer"}
        >
            <div
                id={popupId}
                ref={setPopupEl}
                className={"popup"}
                style={styles.popper}
                {...attributes.popper}
            >
                {content}

                {type === "modal" &&
                    <button
                        id={"closeModal"}
                        onClick={hidePopup}
                        className={"pa1"}
                    >
                        Close
                    </button>
                }

                {type === "tooltip" &&
                    <div
                        ref={setArrow}
                        style={styles.arrow}
                    />
                }

            </div>
        </div>
    )
}

export default Popup