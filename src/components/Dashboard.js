import React from 'react';
import useDashboardQuery from "../queries/useDashboardQuery";
import DateFromInt from '../helpers/Date';
import DashboardChart from './DashboardChart';
import Table from './Table'
import useAuth from "../helpers/useAuth";

const Dashboard = (props) => {
    const auth = useAuth()
    const dashboardQueryVars = { id: auth.user._id }
    const { data, refetch } = useDashboardQuery( {variables: dashboardQueryVars } );
    const apiData = data ?  data.getDashboard : null
    return (
        <div className={"appPage w-100"}>
            {apiData &&
                <div>
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

                    <Table data={apiData.underlying.symbols} numPositions={apiData.underlying.numberOpen} tableType={"dashboardUnderlying"}/>
                </div>
            }
        </div>
    );
};

export default Dashboard;