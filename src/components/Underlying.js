import React, { useState } from 'react';
import Banking from './Banking'
import AddUnderlying from './AddUnderlying'
import Table from './Table'
import useAuth from '../helpers/useAuth'
import useUnderlyingQuery from "../queries/useUnderlyingQuery";


const Underlying = (props) => {

    const auth = useAuth()
    const optionQueryVars = { input: { userId: auth.user._id } }
    const { data, refetch } = useUnderlyingQuery({variables: optionQueryVars });
    const apiData = data ? data.getUnderlying : null

    const [showUnderlyingForm, setShowUnderlyingForm] = useState(false);
    const [underlyingFormButtonText, setUnderlyingFormButtonText] = useState("Add Underlying Trade");

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
                <AddUnderlying underlyingTrades={apiData} showUnderlyingForm={showUnderlyingForm} showForm={showForm} />
            }

            <Banking />

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

export default Underlying;