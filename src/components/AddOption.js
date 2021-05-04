import React, { useReducer, useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useAuth from '../helpers/useAuth'
import useAddOptionMutation from "../queries/useAddOptionMutation";

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

    const auth = useAuth()
    const runAddOption = useAddOptionMutation()
    const [serverResult, setServerResult] = useState(null);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSpread, setIsSpread] = useState(false);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [startDate2, setStartDate2] = useState(startDate);
    const [endDate2, setEndDate2] = useState(endDate);

    const processFormData = () => {
        // Handle Simple Single Options
        const optionInput = {}
        // TODO RESOLVE REAL USERS, hardcoded for initial development only
        optionInput.userId = auth.user._id
        optionInput.symbol = formData.symbol
        // TODO use formData.type, but requires API changes in ENUM plus some logic for bull vs. bear spreads....
        optionInput.type = "P"
        optionInput.spreads = []
        const legs = {legs: []}
        const leg1 = {}
        leg1.qty = parseInt(formData.quantity)
        leg1.isSpread = isSpread
        leg1.entryDate = formData.startDate
        leg1.expirationDate = formData.endDate
        leg1.strike = parseFloat(formData.strike)
        leg1.underlyingEntryPrice = parseFloat(formData.underlyingEntryPrice)
        leg1.initialPremium = parseFloat(formData.premium)
        leg1.notes = formData.notes
        legs.legs.push(leg1)
        optionInput.spreads.push(legs)


        // Handle multiple quantity
        // Validation + Errors
        // HANDLE SPREADS + LEGS
        // Return clean input data for runAddOption mutation! (to write to API/DB)
        const input = {input: optionInput}
        return input
    }

    const handleSubmit = event => {
        event.preventDefault()
        const variables = processFormData()

        runAddOption({variables:variables})
            .then(res => {
                const newPosition = res.data.createOption
                props.refetch()
                if(props.apiData) {
                    // TODO fix updating the Apollo cache, and updating tables with new data, etc.
                }
            })
            .catch((e) => {
                console.error(e)
            })

        // TODO Validate and Process form data, pass into addOptionMutation gql
    }

    const handleChange = event => {
        if(!event.target.name.includes('Date')) event.preventDefault()
        if(event.target.name === 'startDate') setStartDate(event.target.value)
        if(event.target.name === 'endDate') setEndDate(event.target.value)
        if(event.target.name === "type" && event.target.value.includes("Spread")) {
            setIsSpread(true)
        } else if (event.target.name === "type" && !event.target.value.includes("Spread")) {
            setIsSpread(false)
        }
        setFormData({
            name: event.target.name,
            value: event.target.value,
        })
    }

    // Set formData defaults on initial load
    useEffect(() => {
        setFormData({name:"type",value:'Put'})
        setFormData({name:"startDate",value:startDate})
        setFormData({name:"quantity",value:1})
        setFormData({name:"entryCost",value:0})
    },[])

    return (
        <div className={'flex w-100'}>
            {serverResult &&
                <span>{serverResult}</span>
            }
            <form onSubmit={(event) => handleSubmit(event)} className={'pl3'}>
                <fieldset>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Symbol / Ticker</p>
                            <input type={'text'} placeholder={'SPY'} name={'symbol'} onChange={handleChange} />
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Option Type</p>
                            <select value={formData.type} name={'type'} onChange={handleChange}>
                                <option value={"Put"}>Put</option>
                                <option value={"Call"}>Call</option>
                                <option value={"Put Spread"}>Put Spread</option>
                                <option value={"Call Spread"}>Call Spread</option>
                            </select>
                        </label>
                    </div>
                </fieldset>

                    {isSpread &&
                        <>
                        Leg 1
                        </>
                    }
                <fieldset>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Quantity</p>
                            <input className={'numberInput'} name={'quantity'} value={formData.quantity} type={"number"}
                                   onChange={handleChange}/>
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Cost</p>
                            <input className={'numberInput'} name={'entryCost'} value={formData.entryCost} type={"number"} step={'0.01'}
                                   onChange={handleChange}/>
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Underlying Price</p>
                            <input className={'numberInput'} name={'underlyingEntryPrice'} type={"number"} step={'0.01'}
                                   onChange={handleChange}/>
                        </label>
                    </div>
                    <div className={'flex w-100'}>
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
                    </fieldset>
                    {isSpread &&
                    <>
                        Leg 2
                        <fieldset>
                        <div className={'w-50'}>
                            <label>
                                <p className={'required'}>Quantity</p>
                                <input className={'numberInput'} name={'quantity2'} type={"number"}
                                       onChange={handleChange}/>
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label>
                                <p className={'required'}>Cost</p>
                                <input className={'numberInput'} name={'entryCost2'} type={"number"} step={'0.01'}
                                       onChange={handleChange}/>
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label>
                                <p className={'required'}>Underlying Price</p>
                                <input className={'numberInput'} name={'underlyingEntryPrice2'} type={"number"} step={'0.01'}
                                       onChange={handleChange}/>
                            </label>
                        </div>
                        <div className={'flex w-100'}>
                            <div className={'w-50'}>
                                <label className={'w-50'}>
                                    <p className={'required'}>Entry Date</p>
                                    <DatePicker className={'dateInput'} selected={startDate2}
                                                onChange={date => handleChange({
                                                    target: {
                                                        name: 'startDate2',
                                                        value: date
                                                    }
                                                })}/>
                                </label>
                            </div>
                            <div className={'w-50'}>
                                <label className={'w-50'}>
                                    <p className={'required'}>Expiration Date</p>
                                    <DatePicker className={'dateInput'} selected={endDate2}
                                                onChange={date => handleChange({
                                                    target: {
                                                        name: 'endDate2',
                                                        value: date
                                                    }
                                                })}/>
                                </label>
                            </div>
                        </div>
                        <div className={'flex w-100'}>
                            <div className={'w-50'}>
                                <label>
                                    <p className={'required'}>Strike Price</p>
                                    $<input className={'numberInput'} name={'strike2'} type={"number"} step=".01"
                                            placeholder={"Strike"} onChange={handleChange}/>
                                </label>
                            </div>
                            <div className={'w-50'}>
                                <label>
                                    <p className={'required'}>Premium Per Share</p>
                                    $<input className={'numberInput'} name={'premium2'} type={"number"} step=".01"
                                            placeholder={"Premium"} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>
                        </fieldset>
                    </>
                    }
                <fieldset>
                    <div className={'w-50'}>
                        <label>
                            <p>Notes</p>
                            <input type={'textarea'} name={'notes'} onChange={handleChange} />
                        </label>
                    </div>

                    <button type={'submit'} className={'mt3 pa3 add'}>Add Option</button>
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