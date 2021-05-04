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
        type: UnderlyingTradeType
        date: String
        shares: String
        price: String
    }

    input UnderlyingInput {
        userId: ID
        symbol: String
        startDate: Date
        endDate: Date
        underlyingTrades: UnderlyingTradeInput
      }
      input UnderlyingTradeInput {
        type: UnderlyingTradeType
        date: String
        shares: String
        price: String
      }

 */

    const processFormData = () => {
        const underlyingInput = {}
        underlyingInput._id = formData._id
        underlyingInput.userId = auth.user._id
        underlyingInput.symbol = formData.symbol
        underlyingInput.startDate = formData.startDate
        const underlyingTradeInput = {}
        underlyingTradeInput.type = formData.type
        underlyingTradeInput.tradeDate = formData.tradeDate
        underlyingTradeInput.shares = parseInt(formData.shares)
        underlyingTradeInput.price = parseFloat(formData.price)
        underlyingInput.underlyingTrades = underlyingTradeInput
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
                    // TODO if match, setFormData({name:"_id",value:REALID!!!!})
                }
                setValidSymbol(true)
            }
            // Check against open underlying positions
            // Set valid symbol = setValidSymbol(true)
        }
        if(!event.target.name.includes('Date')) event.preventDefault()
        if(event.target.name === 'tradeDate') setTradeDate(event.target.value)
        if(event.target.name === 'startDate') setStartDate(event.target.value)
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
        setFormData({name:"_id",value:null})
    },[])

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