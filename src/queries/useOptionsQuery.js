import {useQuery, gql} from "@apollo/client";

const optionsQuery = gql`
  query getOptionsbyUser($id: ID) {
    getOptionsByUser(_id: $id) {
      _id
      symbol
      spreads {
        legs {
          qty
          entryDate
          strike
          expirationDate
          initialAroi
          notes
        }
      }
  } 
  }
`;

export default (variables) => useQuery(optionsQuery, variables);