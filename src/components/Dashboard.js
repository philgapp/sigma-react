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
    //const { dashboard } = props;
    const dashboard = {}
    dashboard.description = "The first real Sigma dashboard!"
    const { data } = useQuery(dashboardQuery);
    const apiData = data ?  data.getDashboardForUser : null
    return (
        <div className={"w-75"}>
            <div className={"f5 bold lightRed"}>
                {dashboard.description}
            </div>
            <div>
                {apiData &&

                    <>
                    <div className={"flex"}>
                        <div className={"w-third"}>Balance: ${(apiData.balance).toLocaleString()}</div>
                        <div className={"w-two-thirds flex flex-column"}>
                            <div className={"w-50"}>Booked Income: ${(apiData.bookedIncome).toLocaleString()}</div>
                            <div className={"w-50 self-start"}>AROI: {apiData.aroi}%</div>
                        </div>
                    </div>

                    <DashboardChart chartData={{chartData:apiData.chart,balance:apiData.balance}} />

                    <div>Open Options: {apiData.options.numberOpen}</div>
                    <div>Potential Profit: ${(apiData.options.potentialProfit).toLocaleString()}</div>
                    <div>Next Expiration: {DateFromInt(apiData.options.nextExpiry)}</div>
                    <Table data={apiData.underlying.symbols} numPositions={apiData.underlying.numberOpen}/>
                    </>
                }
            </div>
        </div>
    );
};

export default Dashboard;