import {useMutation, gql} from "@apollo/client";

const addUnderlyingMutation = gql`
  mutation createUnderlying($input: UnderlyingInput!) {
      createUnderlying(input: $input) {
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

export default (variables) => {
    const [addUnderlying] = useMutation(addUnderlyingMutation, variables);
    return addUnderlying
};