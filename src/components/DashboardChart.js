import React from 'react';
//import { useQuery, gql } from '@apollo/client';

const DashboardChart = (props) => {
    const { chartData } = props;
    const data = chartData.chartData
    const balance = chartData.balance
    const dashboardChart = {}
    dashboardChart.title = "Dashboard Chart Title"
    return (
        <div>
            <div>
                {dashboardChart.title}
            </div>
            <div>
                {chartData &&
                    <>
                    <div>${data.cash}</div>
                    <div>{((data.cash/balance)*100).toFixed(2) + "%"}</div>
                    <div>${data.options}</div>
                    <div>{((data.options/balance)*100).toFixed(2) + "%"}</div>
                    <div>${data.underlying}</div>
                    <div>{((data.underlying/balance)*100).toFixed(2) + "%"}</div>
                    </>
                }
            </div>
        </div>
    );
};

export default DashboardChart;