import {useMutation, gql} from "@apollo/client";

const addBankingMutation = gql`
  mutation createBanking($input: BankingInput!) {
      createBanking(input: $input) {
          _id
          amount
          date
          type
      }
  }
`;

export default (variables) => {
    const [addBanking] = useMutation(addBankingMutation, variables);
    return addBanking
};