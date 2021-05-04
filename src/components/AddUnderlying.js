import React, { useReducer, useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useAuth from '../helpers/useAuth'
import useAddUnderlyingMutation from "../queries/useAddUnderlyingMutation";

const AddUnderlying = (props) => {

    const underlyingTrades = props.underlyingTrades

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

    const auth = useAuth()
    const runAddUnderlying = useAddUnderlyingMutation()
    const [serverResult, setServerResult] = useState(null);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [validSymbol, setValidSymbol] = useState(false);
    const [newSymbol, setNewSymbol] = useState(false);
    const [tradeDate, setTradeDate] = useState(today);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(null);

    const processFormData = () => {
        const underlyingInput = {}
        underlyingInput.userId = auth.user._id
        underlyingInput.symbol = formData.symbol
        // TODO use formData.type, but requires API changes in ENUM plus some logic for bull vs. bear spreads....
        underlyingInput.type = formData.type
        //underlyingInput.underlyingTrades = []
        const underlyingTrade = {}
        underlyingTrade.shares = parseInt(formData.shares)
        underlyingTrade.price = formData.price
        underlyingTrade.tradeDate = formData.tradeDate
        underlyingTrade.userId = auth.user._id

        //legs.legs.push(leg1)
        //optionInput.spreads.push(legs)

        const input = { input: underlyingInput }
        return input
    }

    const handleSubmit = event => {
        event.preventDefault()
        const variables = processFormData()
        console.log(variables)

        runAddUnderlying({ variables:variables })
            .then(res => {
                console.log('runAddUnderlying Mutation result:')
                console.log(res.data)
            })
            .catch((e) => {
                console.error(e)
            })

        // TODO Validate and Process form data, pass into addUnderlyingMutation gql
    }
    const historyFilter = (array, query) => {
        return array.filter(trade =>
            trade.symbol.toUpperCase().indexOf(query) !== -1
            &&
            !trade.endDate
        )
    }

    const handleChange = event => {
        if(event.target.name === 'symbol') {
            if(event.target.value.length < 1) {
                setValidSymbol(false)
            } else {
                if(underlyingTrades) {
                    console.log(historyFilter(underlyingTrades, event.target.value))
                }
                setValidSymbol(true)
            }
            // Check against open underlying positions
            // Set valid symbol = setValidSymbol(true)
        }
        if(!event.target.name.includes('Date')) event.preventDefault()
        if(event.target.name === 'tradeDate') setTradeDate(event.target.value)
        if(event.target.name === 'startDate') setStartDate(event.target.value)
        if(event.target.name === 'endDate') setEndDate(event.target.value)
        setFormData({
            name: event.target.name,
            value: event.target.value,
        })
    }

    // Set formData defaults on initial load
    useEffect(() => {
        setFormData({name:"type",value:'Buy'})
        setFormData({name:"startDate",value:startDate})
        setFormData({name:"shares",value:1})
        setFormData({name:"price",value:0})
    },[])

/*
    type UnderlyingHistory {
        _id: ID
        userId: ID
        symbol: String
        startDate: Date
        endDate: Date
        underlyingTrades: [UnderlyingTrade]
    }
    type UnderlyingTrade {
        _id: ID
        userId: ID
        type: UnderlyingTradeType
        date: String
        shares: String
        price: String
    }

 */


    return (
        <div className={'flex w-100'}>
            {serverResult &&
                <span>{serverResult}</span>
            }
            <form onSubmit={(event) => handleSubmit(event)} className={'pl3 w-100'}>
                <fieldset>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Symbol / Ticker</p>
                            <input type={'text'} placeholder={'SPY'} name={'symbol'} onChange={handleChange} />
                        </label>
                    </div>
                    {validSymbol &&
                    <div className={'flex w-100'}>
                        <div className={'w-50'}>
                            <label className={'w-50'}>
                                <p className={'required'}>Start Date</p>
                                <DatePicker className={'dateInput'} selected={startDate}
                                            onChange={date => handleChange({
                                                target: {
                                                    name: 'startDate',
                                                    value: date
                                                }
                                            })}/>
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label className={'w-50'}>
                                <p className={'required'}>End Date</p>
                                <DatePicker className={'dateInput'} selected={endDate}
                                            onChange={date => handleChange({target: {name: 'endDate', value: date}})}/>
                            </label>
                        </div>
                    </div>
                    }
                </fieldset>

                {validSymbol &&
                <fieldset>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Trade Type</p>
                            <select value={formData.type} name={'type'} onChange={handleChange}>
                                <option value={"BUY"}>Buy</option>
                                <option value={"SELL"}>Sell</option>
                                <option value={"ASSIGNED"}>Assigned</option>
                                <option value={"CALLED"}>Called</option>
                                <option value={"DIVIDEND"}>Dividend</option>
                            </select>
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label className={'w-50'}>
                            <p className={'required'}>Trade Date</p>
                            <DatePicker className={'dateInput'} selected={tradeDate}
                                        onChange={date => handleChange({target: {name: 'tradeDate', value: date}})}/>
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Number of Shares</p>
                            <input className={'numberInput'} name={'shares'} value={formData.shares} type={"number"}
                                   onChange={handleChange}/>
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Price per Share</p>
                            <input className={'numberInput'} name={'price'} value={formData.price} type={"number"}
                                   step={'0.01'}
                                   onChange={handleChange}/>
                        </label>
                    </div>
                    <button type={'submit'} className={'mt3 pa3 add'}>Add Underlying Trade</button>
                </fieldset>
                }
            </form>
        </div>
    );
}

export default AddUnderlying;