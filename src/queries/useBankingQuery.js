import {useQuery, gql} from "@apollo/client";

const bankingQuery = gql`
  query getBanking($input: BankingQueryInput) {
    getBanking(input: $input) {
      _id
      type
      amount
      date
  } 
  }
`;

const useBankingQuery = (variables) => useQuery(bankingQuery, variables)

export default useBankingQuery