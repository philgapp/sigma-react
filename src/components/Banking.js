import React, { useState } from 'react';
import AddBanking from './AddBanking'
import Table from './Table'
import useAuth from '../helpers/useAuth'
import useBankingQuery from "../queries/useBankingQuery";


const Banking = (props) => {

    const auth = useAuth()
    const bankingQueryVars = { input: { userId: auth.user._id } }
    const { data, refetch } = useBankingQuery({variables: bankingQueryVars });
    const apiData = data ? data.getBanking : null

    const [showBankingForm, setShowBankingForm] = useState(false);
    const [bankingFormButtonText, setBankingFormButtonText] = useState("Add Banking Transaction");

    const showForm = (props) => {
        if (props === false) {
            setShowBankingForm(true)
            setBankingFormButtonText("Hide Form")
        } else {
            setShowBankingForm(false)
            setBankingFormButtonText("Add Banking Transaction")
        }
    }

    return (
        <div className={""}>
            <h3 className={"f3"}>Banking</h3>
            <button onClick={() => showForm(showBankingForm)} className={'ml3 pa3 add'}>
                {bankingFormButtonText}
            </button>

            {showBankingForm &&
                <AddBanking refetch={refetch} showBankingForm={showBankingForm} showForm={showForm} />
            }

            <div>
                {apiData &&
                    <>
                        <Table data={apiData} tableType={"banking"} />
                    </>
                }
            </div>
        </div>
    );
};

export default Banking;