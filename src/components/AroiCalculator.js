import React, { useReducer, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AroiCalculator = (props) => {

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
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [days, setDays] = useState(null)
    const [roi, setRoi] = useState(null)
    const [aroi, setAroi] = useState(null)

    const calcAroi = () => {
        const aroiDays = ((endDate - startDate)/86400000)
        const roi = formData.premium / formData.strike
        const aroi = (roi/aroiDays)*365
        setRoi((roi*100).toFixed(2))
        setAroi((aroi*100).toFixed(2))
    }

    const handleSubmit = event => {
        event.preventDefault()
        calcAroi()
    }

    const handleChange = event => {
        if(event.target.name === 'startDate') setStartDate(event.target.value)
        if(event.target.name === 'endDate') setEndDate(event.target.value)
        setDays((endDate - startDate)/86400000)
        setFormData({
            name: event.target.name,
            value: event.target.value,
        })
    }
    // {symbol ? "for "+symbol ! ""}

    return (
        <div>
            <h3 className={'f3 pa2'}>AROI Calculator</h3>
            <p className={'pa2'}>To quickly check potential returns for trades. Optionally add more detail and quick-add to your open options!</p>
            {aroi &&
            <div className={'pl2 pb2'}>
                <ul className={'list'}>
                    <li key={aroi} className={'pb2'}>Your AROI is <span className={'bold'}>{aroi}%</span></li>
                    <li key={startDate}>Days: {days}</li>
                    <li key={'roi'}>ROI / ROC: {roi}%</li>
                </ul>
            </div>
            }
            <form onSubmit={handleSubmit}>
                <fieldset>
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
                    <button type={'submit'} className={'calculate'}>Calculate</button>
                </fieldset>
            </form>
        </div>
    );
}

export default AroiCalculator;