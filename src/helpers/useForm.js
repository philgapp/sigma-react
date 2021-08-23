import React, {useReducer} from "react";

/*
useForm custom React hook creates a controlled form from simple form elements passed as child components
and handles input changes, form submission and more.
PROPS:
(default) children: child components which should include <label>, <input>, <button type=submit>
submitAction: the function that form submission should be sent to after e.preventDefault()
 */
const useForm = (props) => {

    // REDUCERS

    const formReducer = (state, event) => {
        return {
            ...state,
            [event.name]: event.value
        }
    }
    const childElementReducer = (state, children) => {
        children.every((childEl) => {
            if(childEl) console.log(childEl)
            // TODO add onChange=handleChange and value=formData.NAME attributes to new childElements for rendering controlled form
        })
        return {
            ...state,
            //[event.name]: event.value
        }
    }

    // FUNCTIONS

    const handleChange = event => {
        /*
        if(!event.target.name.includes('Date')) event.preventDefault()
        if(event.target.name === 'startDate') setStartDate(event.target.value)
        if(event.target.name === 'endDate') setEndDate(event.target.value)
        if(event.target.name === "type" && event.target.value.includes("Spread")) {
            setIsSpread(true)
        } else if (event.target.name === "type" && !event.target.value.includes("Spread")) {
            setIsSpread(false)
        }
         */
        setFormData({
            name: event.target.name,
            value: event.target.value,
        })
    }

    // STATE and VARS

    const submitAction = useRef(props.submitAction)
    const [formData, setFormData] = useReducer(formReducer, {});
    const [childFormComponents, setChildFormComponents] = useReducer(childElementReducer,{props.children})



    // RETURN

    return (
        <form onSubmit={submitAction}>
            {childFormComponents}
        </form>
    )

}

// TODO export functionality that may be used in unique situations as well, like formReducer :)
export default useForm()