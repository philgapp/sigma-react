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

export default (variables) => useQuery(bankingQuery, variables);