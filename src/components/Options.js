import React, { useState, useEffect } from 'react';
import useOptionsQuery from "../queries/useOptionsQuery";
import AddOption from './AddOption'
import Table from './Table'
import useAuth from '../helpers/useAuth'
import DateFromInt from "../helpers/Date";

const Options = (props) => {

    const auth = useAuth()
    const userId = auth.user._id
    const [optionQueryVars, setOptionQueryVars] = useState( { input: { userId: userId, open: true } } )
    const { data, refetch } = useOptionsQuery({ variables: optionQueryVars });
    const [optionTableData, setOptionTableData] = useState([])

    const [showOptionForm, setShowOptionForm] = useState(false);
    const [optionFormButtonText, setOptionFormButtonText] = useState("Add an Option Trade");

    const formatOptionDataForTable = (data) => {
        const resultData = []
        // Basic options data only!
        // TODO handle various complex option types
        data.map(option => {
            const arrayItem = {}
            arrayItem._id = option._id
            arrayItem.symbol = option.symbol
            arrayItem.qty = option.spreads[0].legs[0].qty
            arrayItem.entryDate = DateFromInt(option.spreads[0].legs[0].entryDate)
            arrayItem.strike = option.spreads[0].legs[0].strike
            arrayItem.expirationDate = DateFromInt(option.spreads[0].legs[0].expirationDate)
            arrayItem.initialAroi = option.spreads[0].legs[0].initialAroi
            arrayItem.notes = option.spreads[0].legs[0].notes
            resultData.push(arrayItem)
        })
        setOptionTableData(resultData)
    }

    useEffect(() => {
        if(typeof(data) != "undefined") {
            formatOptionDataForTable(data.getOptions)
        }
    },[data])

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
                {(optionTableData.length > 0) &&
                    <>
                        <Table tableType={"allOptions"} data={optionTableData} refetch={refetch} setOptionQueryVars={setOptionQueryVars} userId={userId} />
                    </>
                }
            </div>
        </div>
    );
};

export default Options;