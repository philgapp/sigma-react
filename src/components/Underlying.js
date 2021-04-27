import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AddUnderlying from './AddUnderlying'
import Table from './Table'

const underlyingQuery = gql`
  query getUnderlyingByUser($id:String) {
    getUnderlyingByUser(_id:$id) {
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

const Underlying = (props) => {

    const { data } = useQuery(underlyingQuery);
    const apiData = data ? data.getOptionsByUser : null

    const [showUnderlyingForm, setShowUnderlyingForm] = useState(false);
    const [optionFormButtonText, setOptionFormButtonText] = useState("Add an Underlying Trade");

    const showForm = (props) => {
        if (props === false) {
            setShowUnderlyingForm(true)
            setOptionFormButtonText("Hide Form")
        } else {
            setShowUnderlyingForm(false)
            setOptionFormButtonText("Add an Underlying Trade")
        }
    }

    return (
        <div className={"w-100"}>
            <div className={"f3 pa2"}>
                Underlying Positions
            </div>
            <button onClick={() => showForm(showUnderlyingForm)} className={'ml3 pa3 add'}>
                {optionFormButtonText}
            </button>

            {showUnderlyingForm &&
                <AddUnderlying showUnderlyingForm={showUnderlyingForm} showForm={showForm} />
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

export default Underlying;