import React, { useReducer, useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useAuth from '../helpers/useAuth'
import useEditUnderlyingMutation from "../queries/useEditUnderlyingMutation";
import DateFromInt from '../helpers/Date';

const EditUnderlying = (
    {   position,
        setShowEditForm } ) => {

    const [ positionTrades, setPositionTrades ] = useState([])
    const [ selectedTrade, setSelectedTrade ] = useState({})
    const [ isTradeSelected, setIsTradeSelected ] = useState(false)

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
    const runEditUnderlying = useEditUnderlyingMutation()
    const [ formData, setFormData ] = useReducer(formReducer, {} )

    const selectTrade = ( event ) => {
        event.preventDefault()
        const index = event.target.id
        //setIsTradeSelected(true)
        setSelectedTrade( position.underlyingTrades[ index ] )
    }

    const EditMenu = ( { data } ) => {
        return (
            <nav>
                <h4>Choose an individual trade to edit:</h4>
                { data.map( ( trade ) => {
                    return (
                        <button
                            onClick={ ( e) => selectTrade( e ) }
                            key={ data.indexOf( trade ) }
                            id={ data.indexOf( trade ) } >
                            { DateFromInt( trade.tradeDate ) } - { trade.tradeType } - { trade.tradeShares } shares</button> ) } )
                }
            </nav> )
    }

    const setIndividualTradeData = ( position ) => {
        if( position ) {
            setPositionTrades( position.underlyingTrades.map( ( trade ) => {
                const tradeLeg ={
                    tradeDate: trade.tradeDate,
                    tradeType: trade.type,
                    tradeShares: trade.shares }
                return tradeLeg
            } ) )
        }
    }

    const processFormData = () => {
        const underlyingTradeInput = {
            type: formData.type,
            tradeDate: formData.tradeDate,
            shares: parseInt(formData.shares),
            price: parseFloat(formData.price) }
        const underlyingInput = {
            _id: formData._id,
            userId: auth.user._id,
            //symbol: formData.symbol.toUpperCase(),
            startDate: formData.startDate,
            underlyingTrades: underlyingTradeInput }
        return {
            input: underlyingInput }
    }

    const handleSubmit = event => {
        event.preventDefault()

        const variables = processFormData()

        // Super lame temp validation to prevent unwanted form submissions during dev
        // @TODO typing and validation
        if( variables.input.underlyingTrades.price === 0 && variables.input.underlyingTrades.shares === 0 ) return

        runEditUnderlying( { variables: variables } )
            .then(res => { } )
            .catch( ( e ) => {
                console.error( e ) } )
    }

    const handleChange = event => {
        /*
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

         */
        setFormData(
            {   name: event.target.name,
                value: event.target.value, } )
    }

    // Set formData defaults on initial load
    useEffect(() => {
        if( !isTradeSelected ) {
            setIndividualTradeData( position )
            setIsTradeSelected(true)
            setSelectedTrade( position.underlyingTrades[0] )
        }
        if( isTradeSelected ) {
            if ( ! position.underlyingTrades.includes( selectedTrade ) ) {
                console.log("position changed")
                setIndividualTradeData( position )
                setSelectedTrade( position.underlyingTrades[0] )
            }
            console.log(position)
            console.log(selectedTrade)
            setFormData( { name: "symbol", value: position.symbol } )
            setFormData( { name: "type", value: selectedTrade.type } )
            setFormData( { name: "startDate", value: new Date( position.startDate ) } )
            setFormData( { name: "tradeDate", value: new Date( selectedTrade.tradeDate ) } )
            setFormData( { name: "shares", value: selectedTrade.shares } )
            setFormData( { name: "price", value: selectedTrade.price } )
            setFormData( { name: "_id", value: position._id } )
        }
    },[ position, isTradeSelected, selectedTrade ] )

    return (
        <div className={'flex w-100'}>
            { positionTrades.length > 0 &&
                <EditMenu data={ positionTrades } /> }

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
                                onChange={ handleChange } />
                        </label>
                    </div>

                        <div className={'w-50'}>
                            <label className={'w-50'}>
                                <p className={'required'}>Start Date</p>
                                <DatePicker className={'dateInput'} selected={formData.startDate}
                                            onChange={ date => handleChange(
                                            { target: {
                                                    name: 'startDate',
                                                    value: date
                                                } } ) } />
                            </label>
                        </div>

                </fieldset>

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
                            <DatePicker className={'dateInput'} selected={formData.tradeDate}
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
                        Submit Changes</button>
                    <button className={'mt3 pa3 add'} onClick={ () => setShowEditForm( false ) } >
                        Hide Edit Form</button>
                </fieldset>

            </form>
        </div>
    )
}

export default EditUnderlying