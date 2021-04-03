import React from 'react';
import { useQuery, gql } from '@apollo/client';
import DashboardChart from './DashboardChart';

const dashboardQuery = gql`
  {
    getDashboardForUser(_id: "temp1") {
      balance
      aroi
      bookedIncome
      dashboardChart {
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
    dashboard.description = "The first dashboard!"
    const { data } = useQuery(dashboardQuery);
    return (
        <div>
            <div>
                {dashboard.description}
            </div>
            <div>
                {data &&
                    <>
                    <div>{data.balance}</div>
                    <div>{data.aroi}</div>
                    <div>{data.bookedIncome}</div>
                    <DashboardChart chartData={data.dashboardChart} />
                    <div>{data.options.numberOpen}</div>
                    <div>{data.options.potentialProfit}</div>
                    <div>{data.options.nextExpiry}</div>
                    <div>{data.underlying.numberOpen}</div>
                    {data.underlying.symbols.map((position) => (
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