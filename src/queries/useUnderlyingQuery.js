import {useQuery, gql} from "@apollo/client";

const underlyingQuery = gql`
  query getUnderlying($input: UnderlyingQueryInput) {
    getUnderlying(input: $input) {
      _id
      symbol
      startDate
      endDate
      underlyingTrades {
        type
        date
        shares
        price
      }
  } 
  }
`;

export default (variables) => useQuery(underlyingQuery, variables);