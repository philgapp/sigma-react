import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AddOption from './AddOption'
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

    const [showOptionForm, setShowOptionForm] = useState(false);
    const [optionFormButtonText, setOptionFormButtonText] = useState("Add an Option Trade");

    const showForm = (props) => {
        if (props === false) {
            setShowOptionForm(true)
            setOptionFormButtonText("Hide Form")
        } else {
            setShowOptionForm(false)
            setOptionFormButtonText("Add an Option Trade")
        }
    }

    return (
        <div className={"w-75"}>
            <div className={"f3 pa2"}>
                Options
            </div>
            <button onClick={() => showForm(showOptionForm)}>{optionFormButtonText}</button>

            {showOptionForm &&
                <AddOption showOptionForm={showOptionForm} showForm={showForm} />
            }

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