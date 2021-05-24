import { useQuery, gql } from "@apollo/client";

const underlyingQuery = gql`
  query getUnderlying($input: UnderlyingQueryInput) {
    getUnderlying(input: $input) {
      _id
      symbol
      startDate
      endDate
      currentShares
      rawCostBasis
      adjustedCostBasis
      targetPriceWeek
      targetPriceMonth
      underlyingTrades {
        type
        tradeDate
        shares
        price
      }
  } 
  }
`;

const useUnderlyingQuery = (variables) => useQuery(underlyingQuery, variables);
export default useUnderlyingQuery