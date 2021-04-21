import React from 'react';
import { useQuery, gql } from '@apollo/client';
import DateFromInt from '../helpers/Date';
import DashboardChart from './DashboardChart';
import Table from './Table'

const dashboardQuery = gql`
  {
    getDashboardForUser(_id: "temp1") {
      balance
      aroi
      bookedIncome
      chart {
        cash
        options
        underlying
      }
      options {
        numberOpen
        potentialProfit
        nextExpiry
      }
      underlying {
       numberOpen
       symbols {
        symbol
        qty
        targetPrice
       }
      }
    }
  }
`;

const Dashboard = (props) => {
    const { data } = useQuery(dashboardQuery);
    const apiData = data ?  data.getDashboardForUser : null
    return (
        <div className={"w-100"}>
            <div>
                {apiData &&

                    <>
                    <div className={"flex"}>
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
                    </>
                }
            </div>
        </div>
    );
};

export default Dashboard;