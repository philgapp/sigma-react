import React from 'react';
//import { useQuery, gql } from '@apollo/client';
import { PieChart } from 'react-minimal-pie-chart';

const DashboardChart = (props) => {
    const { chartData } = props;
    const data = chartData.chartData
    const balance = chartData.balance
    const dataForChart = [
            { title: 'Available Cash', value: data.cash, percentage:((data.cash/balance)*100).toFixed(2) + "%", color: '#E38627' },
            { title: 'Open Options', value: data.options, percentage:((data.options/balance)*100).toFixed(2) + "%", color: '#C13C37' },
            { title: 'Underlying Positions', value: data.underlying, percentage:((data.underlying/balance)*100).toFixed(2) + "%", color: '#6A2135' },
        ];
    const dashboardChart = {}
    dashboardChart.title = "Portfolio Distribution"
    return (
        <div className={"dashboardChart"}>
            <div className={"f4 darkRed bold pb3"}>
                {dashboardChart.title}
            </div>
            <div>
                {chartData &&
                    <>
                        <PieChart className={"w-100"}
                            data={dataForChart}
                            lineWidth={40}
                            paddingAngle={2}
                            label={({ dataEntry }) => dataEntry.percentage}
                            labelStyle={(index) => ({
                              fill: dataForChart[index].color,
                              fontSize: '5px',
                              fontFamily: 'sans-serif',
                            })}
                            labelPosition={50}
                        />
                    <p className={'gold'}>
                        Available Cash: ${(data.cash).toLocaleString()}
                    </p>
                    <p className={'lightRed'}>
                        Options Collateral: ${(data.options).toLocaleString()}
                    </p>
                    <p className={'darkRed'}>
                        Underlying Positions: ${(data.underlying).toLocaleString()}
                    </p>
                    </>
                }
            </div>
        </div>
    );
};

export default DashboardChart;