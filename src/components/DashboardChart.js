import React from 'react';
//import { useQuery, gql } from '@apollo/client';

const DashboardChart = (props) => {
    const { chartData } = props;
    const data = chartData.chartData
    const balance = chartData.balance
    const dashboardChart = {}
    dashboardChart.title = "Portfolio Status"
    return (
        <div className={"dashboardChart"}>
            <div className={"f4"}>
                {dashboardChart.title}
            </div>
            <div>
                {chartData &&
                    <>
                    <div>${(data.cash).toLocaleString()}</div>
                    <div>{((data.cash/balance)*100).toFixed(2) + "%"}</div>
                    <div>${(data.options).toLocaleString()}</div>
                    <div>{((data.options/balance)*100).toFixed(2) + "%"}</div>
                    <div>${(data.underlying).toLocaleString()}</div>
                    <div>{((data.underlying/balance)*100).toFixed(2) + "%"}</div>
                    </>
                }
            </div>
        </div>
    );
};

export default DashboardChart;