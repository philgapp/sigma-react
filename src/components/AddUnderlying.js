import React, { useReducer, useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useAuth from '../helpers/useAuth'
import useAddUnderlyingMutation from "../queries/useAddUnderlyingMutation";
import Popup from "../components/Popup"

const AddUnderlying = (
    {   underlyingTrades,
        refetch } ) => {

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
    const [ formData, setFormData ] = useReducer(formReducer, { name: "symbol", value: "" })
    const [ validSymbol, setValidSymbol ] = useState(false)
    const [ tradeDate, setTradeDate ] = useState(today)
    const [ startDate, setStartDate ] = useState(today)
    // Only added to prevent issue with search after changing Underlying query data to closed trades in UI
    const [ openUnderlyingTrades, setOpenUnderlyingTrades] = useState([])

    const [ popupTrigger, setPopupTrigger ] = useState()
    const [ dropdownData, setDropdownData ] = useState([])

    const processFormData = () => {
        const underlyingTradeInput = {
            type: formData.type,
            tradeDate: formData.tradeDate,
            shares: parseInt(formData.shares),
            price: parseFloat(formData.price) }
        const underlyingInput = {
            _id: formData._id,
            userId: auth.user._id,
            symbol: formData.symbol.toUpperCase(),
            startDate: formData.startDate,
            underlyingTrades: underlyingTradeInput }
        return{
            input: underlyingInput }
    }

    const forceSymbolRefresh = () => {
        const elem = document.getElementById("symbol")
        //const event = new Event('input', { bubbles: true } )
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor( window.HTMLInputElement.prototype, "value" ).set
        nativeInputValueSetter.call( elem, "")
        //const trigger = elem.dispatchEvent( event )
        nativeInputValueSetter.call( elem, formData.symbol )
        //const trigger2 = elem.dispatchEvent( event )
    }

    const handleSubmit = event => {
        event.preventDefault()

        const variables = processFormData()
        //console.log(variables)

        // Super lame temp validation to prevent unwanted form submissions during dev
        // @TODO typing and validation
        if( variables.input.price === 0 && variables.input.shares === 0 ) return

        runAddUnderlying({ variables: variables } )
            .then(res => {
                refetch()
                forceSymbolRefresh() } )
            .catch( ( e ) => {
                console.error( e ) } )
    }

    const historyFilter = (openTradesArray, query) => {
        if( (openTradesArray.length < 1) || (query.length < 1) ) return
        if( openTradesArray && query.length > 0 ) {
            // Search only for match starting from the beginning
            const regexQuery = new RegExp( "^" + query )
            const filterResult = openTradesArray.filter( trade =>
                !trade.endDate
                &&
                trade.symbol.toUpperCase().match( regexQuery ) )
            return filterResult }
    }

    const loadUnderlyingPositions = ( matchingPositions, eventValue ) => {
        if( matchingPositions.length ) {
            // setFormData( { name: "_id", value: matchingPositions[0]._id } )
            setFormData( { name: "symbol", value: eventValue } )
            const data = (
                <ul id={ "underlyingDropdownList" } >
                    { matchingPositions.map( ( position ) => (
                        <li key={ position.id } id={ position._id } >
                            { position.symbol }</li> ) ) }
                </ul> )
            setDropdownData( data ) }
    }

    const unloadUnderlyingPositions = () => {
        setFormData( { name: "_id", value: null } )
        setDropdownData( [] )
    }

    const handleChange = event => {
        if( event.target.name === "symbol" ) {
            const eventValue = event.target.value
            setFormData ( { name: "symbol", value: eventValue } )
            if( eventValue < 1 ) {
                setFormData( { name: "_id", value: null } )
                setValidSymbol(false)
                setDropdownData( "" )
                return
            } else {
                if( openUnderlyingTrades.length ) {
                    const matchingOpenTrades = historyFilter( openUnderlyingTrades, event.target.value.toUpperCase() )
                    matchingOpenTrades.length
                        ? loadUnderlyingPositions( matchingOpenTrades, eventValue )
                        : unloadUnderlyingPositions() }
                setValidSymbol(true )
            }
        }
        if( !event.target.name.includes('Date') ) event.preventDefault()
        if( event.target.name === 'tradeDate' ) setTradeDate(event.target.value)
        if( event.target.name === 'startDate' ) setStartDate(event.target.value)
        setFormData(
            {   name: event.target.name,
                value: event.target.value, } )
    }

    // @TODO test changing inputs in non linear order to see if this break some of the data
    // Set formData defaults on initial load
    useEffect(() => {
        setFormData( { name: "type", value: 'Buy' } )
        setFormData( { name: "startDate", value: startDate } )
        setFormData( { name: "tradeDate", value: tradeDate } )
        setFormData( { name: "shares", value: 0 } )
        setFormData( { name: "price", value: 0 } )
        setFormData( { name: "_id", value: null } )
        setOpenUnderlyingTrades( underlyingTrades )
    },[ startDate, tradeDate, underlyingTrades, setOpenUnderlyingTrades ] )

    return (
        <div className={'flex w-100'}>
            <form onSubmit={ ( event) => handleSubmit( event ) }
                  className={'pl3 w-100'}>
                <fieldset>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>
                                Symbol / Ticker</p>
                            <input
                                autoComplete={"off"}
                                value={ formData.symbol }
                                type={'text'}
                                className={"upperCase"}
                                placeholder={'SPY'}
                                id={"symbol"}
                                name={'symbol'}
                                onChange={ handleChange }
                                ref={ setPopupTrigger }/>
                            <p>{formData._id}</p>
                            <p>{formData.symbol}</p>
                            <Popup
                                popupId={"underlyingSymbolDropdown"}
                                type={"inputDropdown"}
                                triggerType={"refInputData"}
                                trigger={ popupTrigger }
                                content={ dropdownData }
                                setInputData={ setFormData }
                                options={ {
                                    offset: [-30, 0],
                                    placement: 'bottom' } } />
                        </label>
                    </div>
                    { validSymbol &&
                        <div className={'w-50'}>
                            <label className={'w-50'}>
                                <p className={'required'}>Start Date</p>
                                <DatePicker className={'dateInput'} selected={startDate}
                                            onChange={ date => handleChange(
                                            { target: {
                                                    name: 'startDate',
                                                    value: date
                                                } } ) } />
                            </label>
                        </div> }

                </fieldset>

                { validSymbol &&
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
                            <p className={'required'}>
                                Trade Date</p>
                            <DatePicker className={'dateInput'} selected={tradeDate}
                                        onChange={date => handleChange({ target: { name: 'tradeDate', value: date } } ) } />
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>
                                Number of Shares</p>
                            <input className={'numberInput'} name={'shares'} value={formData.shares} type={"number"}
                                   onChange={handleChange} />
                        </label>
                    </div>
                    <div className={'w-50'}>
                        <label>
                            <p className={'required'}>
                                Price per Share</p>
                            <input className={'numberInput'} name={'price'} value={formData.price} type={"number"}
                                   step={'0.01'}
                                   onChange={handleChange} />
                        </label>
                    </div>
                    <button type={'submit'} className={'mt3 pa3 add'}>
                        Add Underlying Trade</button>
                </fieldset> }

            </form>
        </div>
    )
}

export default AddUnderlying