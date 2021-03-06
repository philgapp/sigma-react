import React, { useState } from "react";
import useSortableData from "../helpers/useSortableData";
import DateFromInt from '../helpers/Date';
import CustomContextMenu from "./CustomContextMenu";
import { ContextMenuTrigger } from "react-contextmenu";
import Popup from "./Popup";

const Table = (
    {   data,
        tableType,
        numPositions,
        userId,
        refetch,
        setDataVariables,
        archiveText,
        setArchiveText,
        setEditForm,
        setElement } ) => {

    const { items, requestSort, sortConfig } = useSortableData(data);
    const [ switchOptionTypeButton, setSwitchOptionTypeButton ] = useState("Open")

    const collect = ( element ) => {
        return { element: element } }

    const toggleOptionTypeButton = ( content ) => {
        if( content === "Open" ) {
            setSwitchOptionTypeButton("Closed")
            setDataVariables( { input: { userId: userId, open: false } } )
        } else {
            setSwitchOptionTypeButton("Open")
            setDataVariables( { input: { userId: userId, open: true } } )
        }
        refetch()
    }

    const getClassNamesFor = ( name ) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const [ popupTrigger, setPopupTrigger ] = useState()
    const [ arrowElement, setArrowElement ] = useState()

    return (
        <>
            { popupTrigger &&
                <Popup
                    popupId={"testId"}
                    type={"tooltip"}
                    triggerType={"mouseover"}
                    trigger={popupTrigger}
                    arrow={arrowElement}
                    setArrow={setArrowElement}
                    content={"Test popup content!"}
                    options={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [20, 8], }, },
                            {
                                name: 'arrow',
                                options: {
                                    enabled: "true",
                                    element: arrowElement } }
                        ],
                        placement: 'top' } } /> }

            { tableType === "dashboardUnderlying" &&

            <table>
                <caption
                    ref={ setPopupTrigger }
                    className={'f4 darkRed bold pb3'}>
                    Open Underlying Positions: { numPositions }
                </caption>
                <thead>
                <tr key={"header-row"}>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('symbol') }
                            className={ getClassNamesFor('symbol') }>
                            Symbol
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('qty') }
                            className={ getClassNamesFor('qty') } >
                            Qty
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('targetPrice') }
                            className={ getClassNamesFor('targetPrice') } >
                            Target Sell Price </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                { items.map( ( item, index) => (
                    <tr key={index}>
                        <td>{ item.symbol }</td>
                        <td>{ item.qty }x</td>
                        <td>${ item.targetPrice }</td>
                    </tr> ) ) }
                </tbody>
            </table> }


            { tableType === "allOptions" &&
            <>
            <table>
                <caption className={'f4 darkRed bold pb3'}>
                    <button onClick={ () => toggleOptionTypeButton(switchOptionTypeButton) }>
                        { switchOptionTypeButton }</button>
                    Option Positions
                </caption>
                <thead>
                <tr key={"header-row"}>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('symbol') }
                            className={ getClassNamesFor('symbol') } >
                            Symbol</button> </th>
                    <th>
                        Qty</th>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('entryDate') }
                            className={ getClassNamesFor('entryDate') } >
                            Entry Date</button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('strike') }
                            className={ getClassNamesFor('strike') } >
                            Strike</button> </th>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('expirationDate') }
                            className={ getClassNamesFor('expirationDate') } >
                            Expiration Date</button> </th>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('aroi') }
                            className={ getClassNamesFor('aroi') } >
                            AROI</button> </th>
                    <th>
                        <button
                            type="button"
                            onClick={ () => requestSort('notes')}
                            className={ getClassNamesFor('notes') } >
                            Notes</button> </th>
                </tr>
                </thead>
                <tbody>

                { items.map( ( item ) => (
                    <ContextMenuTrigger
                        renderTag={ "tr" }
                        key={ item._id }
                        name={ item._id }
                        id={ "SIMPLE_" + item._id }
                        optionId={ item._id }
                        collect={ collect } >
                        <td>{ item.symbol }</td>
                        <td>{ item.qty }</td>
                        <td>{ item.entryDate }</td>
                        <td>${ item.strike }</td>
                        <td>{ item.expirationDate }</td>
                        <td>{ item.initialAroi }%</td>
                        <td>{ item.notes }</td>
                    </ContextMenuTrigger> ) ) }

                { items.map( ( item, index) => (
                    <CustomContextMenu
                        key={ item._id }
                        elementId={ "SIMPLE_" + item._id }
                        archiveText={ archiveText }
                        setArchiveText={ setArchiveText } /> ) ) }

                </tbody>
            </table>
            </> }


            { tableType === "banking" &&
            <table>
                <caption className={'f4 darkRed bold pb3'}>
                    Banking Transactions</caption>
                <thead>
                <tr key={"header-row"}>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('date')}
                            className={getClassNamesFor('date')} >
                            Date</button> </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('type')}
                            className={getClassNamesFor('type')} >
                            Type</button> </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('amount')}
                            className={getClassNamesFor('amount')} >
                            Amount
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>

                { items.map( ( item, index) => (
                    <tr key={ index }>
                        <td>{DateFromInt(item.date)}</td>
                        <td>{item.type}</td>
                        <td>${item.amount.toLocaleString()}</td>
                    </tr> ) ) }
                </tbody>
            </table> }


            { tableType === "allUnderlying" &&
            <>
                <table>
                    <caption className={'f4 darkRed bold pb3'}>
                        <button onClick={() => toggleOptionTypeButton( switchOptionTypeButton )}>
                            { switchOptionTypeButton }</button>
                        Underlying Positions</caption>
                    <thead>
                    <tr key={"header-row"}>
                        <th key={"symbol"}>
                            <button
                                type="button"
                                onClick={() => requestSort('symbol')}
                                className={getClassNamesFor('symbol')} >
                                Symbol</button> </th>
                        <th key={"shares"}>
                            <button
                                type="button"
                                onClick={() => requestSort('currentShares')}
                                className={getClassNamesFor('currentShares')} >
                                Shares</button> </th>
                        <th key={"startDate"}>
                            <button
                                type="button"
                                onClick={() => requestSort('startDate')}
                                className={getClassNamesFor('startDate')}>
                                Start Date</button> </th>
                        <th key={"rawCostBasis"}>
                            <button
                                type="button"
                                onClick={() => requestSort('rawCostBasis')}
                                className={getClassNamesFor('rawCostBasis')}>
                                Raw Cost Basis</button> </th>
                        <th key={"targetPriceWeekly"}>
                            <button
                                type="button"
                                onClick={() => requestSort('targetPriceWeek')}
                                className={getClassNamesFor('targetPriceWeek')}>
                                Target Price (1 week)</button> </th>
                        <th key={"targetPriceMonthly"}>
                            <button
                                type="button"
                                onClick={() => requestSort('targetPriceMonth')}
                                className={getClassNamesFor('targetPriceMonth')}>
                                Target Price (1 month)</button> </th>
                    </tr>
                    </thead>
                    <tbody>

                    { items.map( ( item ) => (
                        <ContextMenuTrigger
                            renderTag={"tr"}
                            name={item._id}
                            optionId={item._id}
                            key={item._id}
                            collect={collect}
                            id={"SIMPLE_" + item._id}>
                            <td key={item._id + 1}>{item.symbol}</td>
                            <td key={item._id + 2}>{item.currentShares}</td>
                            <td key={item._id + 3}>{DateFromInt(item.startDate)}</td>
                            <td key={item._id + 4}>${item.rawCostBasis}</td>
                            <td key={item._id + 5}>${item.targetPriceWeek}</td>
                            <td key={item._id + 6}>${item.targetPriceMonth}</td>
                        </ContextMenuTrigger> ) ) }

                    { items.map( ( item ) => (
                        <CustomContextMenu
                            key={ item._id + 1 }
                            elementId={"SIMPLE_" + item._id}
                            archiveText={ archiveText }
                            setArchiveText={ setArchiveText }
                            setEditForm={ setEditForm }
                            setElement={ setElement } /> ) ) }

                    </tbody>
                </table>
            </> }
        </>
    )
}

export default Table;