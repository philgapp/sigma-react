import { useState } from "react";

const useOptionForm = () => {

    const [showOptionForm, setShowOptionForm] = useState(false);
    const [optionFormButtonText, setOptionFormButtonText] = useState("Add Option Trade");

    const showForm = (input) => {
        if (input === false) {
            setShowOptionForm(true)
            setOptionFormButtonText("Hide Form")
        } else {
            setShowOptionForm(false)
            setOptionFormButtonText("Add Option Trade")
        }
    }
    return {
        showOptionForm,
        setShowOptionForm,
        optionFormButtonText,
        showForm
    }
}

export default useOptionForm
