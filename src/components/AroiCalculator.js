import React, {useReducer, useState, useEffect, useCallback} from 'react';
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

    const calcAroi = useCallback( () => {
        const aroiDays = ((endDate - startDate)/86400000)
        setDays(aroiDays)
        const tempRoi = formData.premium / formData.strike
        const tempAroi = (tempRoi/aroiDays)*365
        setRoi((tempRoi*100).toFixed(2))
        if(!isNaN(tempAroi)) setAroi((tempAroi*100).toFixed(2))
    }, [ formData.strike, formData.premium, startDate, endDate ] )

    useEffect(() => {
        calcAroi()
    }, [ formData.strike, formData.premium, startDate, endDate, days, calcAroi ])

    const handleChange = event => {
        if(event.target.name === 'startDate') setStartDate(event.target.value)
        if(event.target.name === 'endDate') setEndDate(event.target.value)
        setFormData({
            name: event.target.name,
            value: event.target.value,
        })
    }
    // {symbol ? "for "+symbol ! ""}

    return (
        <div className={"appPage"}>
            <h3 className={'f3'}>AROI Calculator</h3>
            <p className={'pl3 '}>Quickly review potential trade idea returns.</p>
            {aroi &&
            <div className={'pl2'}>
                <ul className={'list mb0'}>
                    <li key={aroi} className={'pb3'}>AROI: <span className={'bold'}>{aroi}%</span></li>
                    <li key={startDate} className={'pb1'}>Days: {days}</li>
                    <li key={'roi'} >ROI: {roi}%</li>
                </ul>
            </div>
            }
            <form className={'aroiCalcForm pt3'}>
                <fieldset>
                    <div className={'flex w-100'}>
                        <div className={'w-50'}>
                            <label className={'w-50 aroiCalc'}>
                                <p className={'required'}>Entry Date</p>
                                <DatePicker className={'dateInput'} selected={startDate} onChange={date => handleChange({target: {name:'startDate',value:date}})} />
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label className={'w-50 aroiCalc'}>
                                <p className={'required'}>Expiration Date</p>
                                <DatePicker className={'dateInput'} selected={endDate} onChange={date => handleChange({target: {name:'endDate',value:date}})} />
                            </label>
                        </div>
                    </div>
                    <div className={'flex w-100 pt3'}>
                        <div className={'w-50'}>
                            <label className={'aroiCalc'}>
                                <p className={'required'}>Strike Price</p>
                                $<input className={'numberInput'} name={'strike'} type={"number"} step=".01" placeholder={"Strike"} onChange={handleChange} />
                            </label>
                        </div>
                        <div className={'w-50'}>
                            <label className={'aroiCalc'}>
                                <p className={'required'}>Premium Per Share</p>
                                $<input className={'numberInput'} name={'premium'} type={"number"} step=".01" placeholder={"Premium"} onChange={handleChange} />
                            </label>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}

export default AroiCalculator;