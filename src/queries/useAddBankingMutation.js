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

const useAddBankingMutation = (variables) => {
    const [addBanking] = useMutation(addBankingMutation, variables);
    return addBanking
}

export default useAddBankingMutation