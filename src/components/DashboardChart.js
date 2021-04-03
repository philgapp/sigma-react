import React from 'react';
//import { useQuery, gql } from '@apollo/client';

const DashboardChart = (props) => {
    const { data } = props;
    const dashboardChart = {}
    dashboardChart.title = "Dashboard Chart Title"
    return (
        <div>
            <div>
                {dashboardChart.title}
            </div>
            <div>
                {data &&
                    <>
                    <div>{data.balance}</div>
                    <div>{data.cash}</div>
                    <div>{data.options}</div>
                    <div>{data.underlying}</div>
                    </>
                }
            </div>
        </div>
    );
};

export default DashboardChart;