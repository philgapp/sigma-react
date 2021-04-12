import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Table from './Table'

const optionsQuery = gql`
  {
    getOptionsByUser(_id:"temp1") {
      _id
      symbol
      user {
        email
      }
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

const Options = (props) => {
    const { data } = useQuery(optionsQuery);
    const apiData = data ?  data.getOptionsByUser : null
    return (
        <div className={"w-75"}>
            <div className={"f3 pa2"}>
                Options
            </div>
            <div>
                {apiData &&
                    <>
                        <Table data={apiData} tableType={"allOptions"} />
                    </>
                }
            </div>
        </div>
    );
};

export default Options;