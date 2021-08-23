import {gql, useQuery} from "@apollo/client";

const dashboardQuery = gql`
  query getDashboard($id: ID) {
    getDashboard(_id: $id) {
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

const useDashboardQuery = (variables) => useQuery(dashboardQuery, variables)

export default useDashboardQuery