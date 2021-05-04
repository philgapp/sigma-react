import {useQuery, gql} from "@apollo/client";

const optionsQuery = gql`
  query getOptions($input: OptionQueryInput) {
    getOptions(input: $input) {
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