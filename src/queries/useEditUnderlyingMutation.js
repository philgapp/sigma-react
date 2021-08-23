import { useMutation, gql } from "@apollo/client";

const editUnderlyingMutation = gql`
  mutation editUnderlying( $input: EditUnderlyingInput! ) {
      editUnderlying( input: $input ) {
          _id
          startDate
          underlyingTrades {
            type
            tradeDate
            shares
            price }
      }
  }
`;

const useEditUnderlyingMutation = ( variables ) => {
    const [ editUnderlying ] = useMutation( editUnderlyingMutation, variables );
    return editUnderlying
}

export default useEditUnderlyingMutation