import {useMutation, gql} from "@apollo/client";

const addOptionMutation = gql`
  mutation createOption($input: OptionInput!) {
      createOption(input: $input) {
        _id
        symbol
        type
        spreads {
            _id
            legs {
                _id
                qty
                isSpread
            }
        }
      }
  }
`;

export default (variables) => {
    const [addOption] = useMutation(addOptionMutation, variables);
    return addOption
};