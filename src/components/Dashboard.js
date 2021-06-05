import React from 'react';
import useDashboardQuery from "../queries/useDashboardQuery";
import DateFromInt from '../helpers/Date';
import DashboardChart from './DashboardChart';
import Table from './Table'
import useAuth from "../helpers/useAuth";
import { withRouter } from "react-router-dom";

const Dashboard = (props) => {
    const auth = useAuth()
    const {
        showForm,
        showOptionForm,
        optionFormButtonText,
    } = props
    const dashboardQueryVars = { id: auth.user._id }
    const { data, refetch } = useDashboardQuery( {variables: dashboardQueryVars } );
    const apiData = data ?  data.getDashboard : null

    const handleClick = (event) => {
        event.preventDefault()
        showForm(false)
        props.history.push('/options')
    }

    return (
        <div className={"appPage w-100"}>
            {apiData &&
                <div>
                    {!showOptionForm &&
                    <button onClick={handleClick} className={'ml3 mt4 pa3 add'}>
                        {optionFormButtonText}
                    </button>
                    }
                    <div className={"dashPage flex"}>
                        <div className={"dashboardLeft w-50 pl4"}>
                            <p className={"dashboardLabel"} >
                                Balance
                            </p>
                            <p className={"dashboardValue"} >
                                ${(apiData.balance).toLocaleString()}
                            </p>
                        </div>
                        <div className={"dashboardRight w-50 flex flex-column pr4"}>
                            <p className={"dashboardLabel"}>
                                Booked Income
                            </p>
                            <p className={"dashboardValue"}>
                                ${(apiData.bookedIncome).toLocaleString()}
                            </p>
                            <p className={"dashboardLabel"}>
                                AROI
                            </p>
                            <p className={"dashboardValue"}>
                                {apiData.aroi}%
                            </p>
                        </div>
                    </div>

                    <DashboardChart chartData={{chartData:apiData.chart,balance:apiData.balance}} />

                    <div className={"dashboardOptions"}>
                        <p className={"dashboardLabel"}>Open Options: <span className={"bold"} >{apiData.options.numberOpen}</span></p>
                        <p className={"dashboardLabel"}>Potential Profit: <span className={"bold"} >${(apiData.options.potentialProfit).toLocaleString()}</span></p>
                        <p className={"dashboardLabel"}>Next Expiration: <span className={"bold"} >{DateFromInt(apiData.options.nextExpiry)}</span></p>
                    </div>

                    <Table
                        data={apiData.underlying.symbols}
                        numPositions={apiData.underlying.numberOpen}
                        tableType={"dashboardUnderlying"}
                        refetch={refetch}
                    />
                </div>
            }
        </div>
    );
};

export default withRouter(Dashboard);