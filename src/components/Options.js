import React, { useState } from 'react';
import useOptionsQuery from "../queries/useOptionsQuery";
import AddOption from './AddOption'
import Table from './Table'
import useAuth from '../helpers/useAuth'

const Options = (props) => {

    const auth = useAuth()
    const { data, refetch } = useOptionsQuery({variables: {id: auth.user._id} });
    const apiData = data ? data.getOptionsByUser : null

    const [showOptionForm, setShowOptionForm] = useState(false);
    const [optionFormButtonText, setOptionFormButtonText] = useState("Add an Option Trade");

    const showForm = (props) => {
        if (props === false) {
            setShowOptionForm(true)
            setOptionFormButtonText("Hide Form")
        } else {
            setShowOptionForm(false)
            setOptionFormButtonText("Add an Option Trade")
        }
    }

    return (
        <div className={"appPage w-100"}>
            <h3 className={"f3"}>Option Positions</h3>
            <button onClick={() => showForm(showOptionForm)} className={'ml3 pa3 add'}>
                {optionFormButtonText}
            </button>

            {showOptionForm &&
                <AddOption refetch={refetch} showOptionForm={showOptionForm} showForm={showForm} />
            }

            <div>
                {apiData &&
                    <>
                        <Table data={apiData} tableType={"allOptions"} />
                    </>
                }
            </div>
        </div>
    );
};

export default Options;