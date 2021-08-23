import {useMutation, gql} from "@apollo/client";

const addUnderlyingMutation = gql`
  mutation createUnderlying($input: UnderlyingInput!) {
      createUnderlying(input: $input) {
          _id
          symbol
          startDate
          underlyingTrades {
            type
            tradeDate
            shares
            price
          }
      }
  }
`;

const useAddUnderlyingMutation = (variables) => {
    const [addUnderlying] = useMutation(addUnderlyingMutation, variables);
    return addUnderlying
}

export default useAddUnderlyingMutation