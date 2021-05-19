import React, {useEffect, useState} from 'react';
import Banking from './Banking'
import AddUnderlying from './AddUnderlying'
import Table from './Table'
import useAuth from '../helpers/useAuth'
import useUnderlyingQuery from "../queries/useUnderlyingQuery";
import DateFromInt from "../helpers/Date";


const Underlying = (props) => {

    const auth = useAuth()
    const userId = auth.user._id
    const [optionQueryVars, setOptionQueryVars] = useState( { input: { userId: userId, open: true } } )
    const { data, refetch } = useUnderlyingQuery({ variables: optionQueryVars });
    const [underlyingTableData, setOptionTableData] = useState([])

    const [showUnderlyingForm, setShowUnderlyingForm] = useState(false);
    const [underlyingFormButtonText, setUnderlyingFormButtonText] = useState("Add Underlying Trade");

    const formatDataForTable = (data) => {
        const resultData = []
        data.map(trade => {
            resultData.push(trade)
        })
        setOptionTableData(resultData)
    }

    useEffect(() => {
        if(data !== undefined) {
            formatDataForTable(data.getUnderlying)
        }
    },[data])

    const showForm = (props) => {
        if (props === false) {
            setShowUnderlyingForm(true)
            setUnderlyingFormButtonText("Hide Form")
        } else {
            setShowUnderlyingForm(false)
            setUnderlyingFormButtonText("Add Underlying Trade")
        }
    }

    return (
        <div className={"appPage w-100"}>
            <h3 className={"f3"}>Underlying Positions</h3>
            <button onClick={() => showForm(showUnderlyingForm)} className={'ml3 pa3 add'}>
                {underlyingFormButtonText}
            </button>

            {showUnderlyingForm &&
                <AddUnderlying underlyingTrades={underlyingTableData} refetch={refetch} showUnderlyingForm={showUnderlyingForm} showForm={showForm} />
            }

            <Banking />

            <div>
                {(underlyingTableData.length > 0) &&
                    <>
                        <Table data={underlyingTableData} tableType={"allUnderlying"} refetch={refetch} setOptionQueryVars={setOptionQueryVars} />
                    </>
                }
            </div>
        </div>
    );
};

export default Underlying;