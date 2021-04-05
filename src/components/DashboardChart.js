import React from 'react';
//import { useQuery, gql } from '@apollo/client';
import { PieChart } from 'react-minimal-pie-chart';

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
                        <PieChart className={"w-50"}
                            data={[
                                { title: 'Available Cash', value: data.cash, color: '#E38627' },
                                { title: 'Open Options', value: data.options, color: '#C13C37' },
                                { title: 'Underlying Positions', value: data.underlying, color: '#6A2135' },
                            ]}
                        />
                    <div></div>
                    <div>Available Cash: {((data.cash/balance)*100).toFixed(2) + "%"}</div>
                    <div></div>
                    <div>Options Collateral: {((data.options/balance)*100).toFixed(2) + "%"}</div>
                    <div></div>
                    <div>Underlying Positions: {((data.underlying/balance)*100).toFixed(2) + "%"}</div>
                    </>
                }
            </div>
        </div>
    );
};

export default DashboardChart;