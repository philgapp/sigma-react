import React, { useReducer, useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { useQuery, gql } from '@apollo/client';

const addOptionMutation = gql`
  mutation {
  createOption(input: {
    userId: "temp1",
    symbol: "TSLA",
    type: P,
    spreads: [
      {
        legs: [
          {
            qty: 1,
            isSpread: false,
            entryDate: 1617235200000,
            expirationDate: 1621555200000,
            strike: 22.5,
            underlyingEntryPrice: 24,
            initialPremium: 0.9,
            notes: "Just some random test notes to play with...",
          }
        ]
      }
    ]
  }) {
      _id
      symbol
      type
      spreads {
        _id
        legs {
          _id
          qty
          entryDate
          strike
          expirationDate
          initialPremium
          initialRoi
          initialAroi
          capitalRequirement
          notes
        }
      }
      user {
        _id
        firstName
        email
      }
    }
}
`;

const AddOption = (props) => {

    const formReducer = (state, event) => {
        return {
            ...state,
            [event.name]: event.value
        }
    }

    const today = () => {
        const d = new Date()
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d
    }

    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSpread, setIsSpread] = useState(false);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [days, setDays] = useState(null)
    const [roi, setRoi] = useState(null)
    const [aroi, setAroi] = useState(null)

    const calcAroi = () => {
        const aroiDays = ((endDate - startDate)/86400000)
        const roi = formData.premium / formData.strike
        const aroi = (roi/aroiDays)*365
        if(!isNaN(roi) && !isNaN(aroi)) {
            setRoi((roi * 100).toFixed(2))
            setAroi((aroi * 100).toFixed(2))
        }
    }

    const handleSubmit = event => {
        event.preventDefault()
        console.log(formData)
        // TODO Validate and Process form data, pass into addOptionMutation gql
    }

    const handleChange = event => {
        if(! event.target.name.includes('Date')) event.preventDefault()
        if(event.target.name === 'startDate') setStartDate(event.target.value)
        if(event.target.name === 'endDate') setEndDate(event.target.value)
        setDays((endDate - startDate)/86400000)
        setFormData({
            name: event.target.name,
            value: event.target.value,
        })
    }

    useEffect(() => {
        calcAroi()
    },[formData.premium,formData.strike,startDate,endDate])

    return (
        <div className={'flex w-100'}>
            <form onSubmit={() => handleSubmit}>
                <fieldset>
                    <div className={'w-100'}>
                        <div className={'w-100'}>
                            <label >
                                <p className={'required'}>Symbol / Ticker</p>
                                <input type={'text'} placeholder={'SPY'} className={'symbol'} onChange={handleChange} />
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label className={'w-50'}>
                                <p className={'required'}>Entry Date</p>
                                <DatePicker className={'dateInput'} selected={startDate} onChange={date => handleChange({target: {name:'startDate',value:date}})} />
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label className={'w-50'}>
                                <p className={'required'}>Expiration Date</p>
                                <DatePicker className={'dateInput'} selected={endDate} onChange={date => handleChange({target: {name:'endDate',value:date}})} />
                            </label>
                        </div>
                    </div>
                    <div className={'flex w-100'}>
                        <div className={'w-50'}>
                            <label>
                                <p className={'required'}>Strike Price</p>
                                $<input className={'numberInput'} name={'strike'} type={"number"} step=".01" placeholder={"Strike"} onChange={handleChange} />
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label>
                                <p className={'required'}>Premium Per Share</p>
                                $<input className={'numberInput'} name={'premium'} type={"number"} step=".01" placeholder={"Premium"} onChange={handleChange} />
                            </label>
                        </div>
                    </div>
                    <button type={'submit'} className={'add'}>Add Option</button>
                </fieldset>
            </form>

            {/*
                this.state.showMenu
                    ? (
                        <div className={'addItemMenu'}>
                            <ul
                                className="menu list"
                                ref={(element) => {
                                    this.dropdownMenu = element;
                                }}
                            >
                                <li>Add an Option Trade</li>
                                <li>Add an Underlying Trade</li>
                                <li>Add a Banking Transaction</li>
                            </ul>
                        </div>
                    )
                    : (
                        null
                    )
            */
            }
        </div>
    );
}

export default AddOption;