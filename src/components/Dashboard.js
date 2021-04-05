import React from 'react';
import { useQuery, gql } from '@apollo/client';
import DateFromInt from '../helpers/Date';
import DashboardChart from './DashboardChart';

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
        <div>
            <div>
                {dashboard.description}
            </div>
            <div>
                {apiData &&

                    <>
                    <div>{apiData.balance}</div>
                    <div>{apiData.aroi}</div>
                    <div>{apiData.bookedIncome}</div>
                    <DashboardChart chartData={{chartData:apiData.chart,balance:apiData.balance}} />
                    <div>{apiData.options.numberOpen}</div>
                    <div>{apiData.options.potentialProfit}</div>
                    <div>{DateFromInt(apiData.options.nextExpiry)}</div>
                    <div>{apiData.underlying.numberOpen}</div>
                    {apiData.underlying.symbols.map((position) => (
                        <div>
                            <div>{position.symbol}</div>
                            <div>{position.qty}</div>
                            <div>{position.targetPrice}</div>
                        </div>
                    ))}
                    </>
                }
            </div>
        </div>
    );
};

export default Dashboard;