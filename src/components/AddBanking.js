import React, { useReducer, useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useAuth from '../helpers/useAuth'
import useAddBankingMutation from "../queries/useAddBankingMutation";

const AddBanking = (props) => {

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
    const runAddBanking = useAddBankingMutation()
    const [formData, setFormData] = useReducer(formReducer, {});
    const [date, setDate] = useState(today);

    const processFormData = () => {
        const bankingInput = {}
        bankingInput.userId = auth.user._id
        // TODO use formData.type, but requires API changes in ENUM plus some logic for bull vs. bear spreads....
        bankingInput.type = formData.type
        bankingInput.amount = parseFloat(formData.amount)
        bankingInput.date = formData.date
        const input = { input: bankingInput }
        return input
    }

    const handleSubmit = event => {
        event.preventDefault()
        const variables = processFormData()
        console.log(variables)

        runAddBanking({ variables:variables })
            .then(res => {
                console.log('runAddUnderlying Mutation result:')
                console.log(res.data)
                props.refetch()
            })
            .catch((e) => {
                console.error(e)
            })

        // TODO Validate and Process form data, pass into addUnderlyingMutation gql
    }

    const handleChange = event => {
        if(!event.target.name.includes('date')) event.preventDefault()
        if(event.target.name === 'date') setDate(event.target.value)
        setFormData({
            name: event.target.name,
            value: event.target.value,
        })
    }

    // Set formData defaults on initial load
    useEffect(() => {
        setFormData({ name: "date", value: date })
        setFormData({ name: "type", value: "Deposit" })
    },[])

    return (
        <div className={'flex w-100'}>
            <form onSubmit={(event) => handleSubmit(event)} className={'pl3 w-100'}>
                <fieldset>

                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Transaction Type</p>
                            <select value={formData.type} name={'type'} onChange={handleChange}>
                                <option value={"Deposit"}>Deposit</option>
                                <option value={"Withdrawal"}>Withdrawal</option>
                            </select>
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label className={'w-50'}>
                            <p className={'required'}>Date</p>
                            <DatePicker className={'dateInput'} selected={date}
                                        onChange={date => handleChange({target: {name: 'date', value: date}})}/>
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>Amount</p>
                            <input className={'numberInput'} name={'amount'} value={formData.amount} type={"number"} step={'0.01'}
                                   onChange={handleChange}/>
                        </label>
                    </div>
                    <button type={'submit'} className={'mt3 pa3 add'}>Add Banking Transaction</button>
                </fieldset>
            </form>
        </div>
    );
}

export default AddBanking;