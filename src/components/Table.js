import {useState} from "react";
import useSortableData from "../helpers/useSortableData";
import DateFromInt from '../helpers/Date';
import CustomContextMenu from "./CustomContextMenu";
import { ContextMenuTrigger } from "react-contextmenu";

const Table = (props) => {
    const tableType = props.tableType
    const numPositions = props.numPositions

    const { items, requestSort, sortConfig } = useSortableData(props.data);

    const [switchOptionTypeButton, setSwitchOptionTypeButton] = useState("Open")
    const userId = props.userId
    const refreshData = props.refetch
    const setDataVariables = props.setOptionQueryVars

    const collect = props => {
        return { id: props.optionId  }
    }

    const toggleOptionTypeButton = (content) => {
        if (content == "Open") {
            setSwitchOptionTypeButton("Closed")
            setDataVariables( { input: { userId: userId, open: false } } )
        } else {
            setSwitchOptionTypeButton("Open")
            setDataVariables( { input: { userId: userId, open: true } } )
        }
        refreshData()
    }

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    return (
        <>

            {tableType === "dashboardUnderlying" &&
            <table>
                <caption className={'f4 darkRed bold pb3'}>Open Underlying Positions: {numPositions}</caption>
                <thead>
                <tr>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('symbol')}
                            className={getClassNamesFor('symbol')}
                        >
                            Symbol
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('qty')}
                            className={getClassNamesFor('qty')}
                        >
                            Qty
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('targetPrice')}
                            className={getClassNamesFor('targetPrice')}
                        >
                            Target Sell Price
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>

                {items.map( (item) => (
                    <tr key={item.id}>
                        <td>{item.symbol}</td>
                        <td>{item.qty}x</td>
                        <td>${item.targetPrice}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            }


            {tableType === "allOptions" &&
            <>
            <table>
                <caption className={'f4 darkRed bold pb3'}><button onClick={() => toggleOptionTypeButton(switchOptionTypeButton)}>{switchOptionTypeButton}</button> Option Positions</caption>
                <thead>
                <tr>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('symbol')}
                            className={getClassNamesFor('symbol')}
                        >
                            Symbol
                        </button>
                    </th>
                    <th>
                        Qty
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('entryDate')}
                            className={getClassNamesFor('entryDate')}
                        >
                            Entry Date
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('strike')}
                            className={getClassNamesFor('strike')}
                        >
                            Strike
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('expirationDate')}
                            className={getClassNamesFor('expirationDate')}
                        >
                            Expiration Date
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('aroi')}
                            className={getClassNamesFor('aroi')}
                        >
                            AROI
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('notes')}
                            className={getClassNamesFor('notes')}
                        >
                            Notes
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>

                {items.map( (item) => (
                    <ContextMenuTrigger renderTag={"tr"} name={item._id} optionId={item._id} key={item._id} collect={collect} id={"SIMPLE"}>
                        <td>{item.symbol}</td>
                        <td>{item.qty}</td>
                        <td>{item.entryDate}</td>
                        <td>${item.strike}</td>
                        <td>{item.expirationDate}</td>
                        <td>{item.initialAroi}%</td>
                        <td>{item.notes}</td>
                    </ContextMenuTrigger>
                ))}
                </tbody>
            </table>

            <CustomContextMenu type={"option"} actions={null} />
            </>
            }


            {tableType === "banking" &&
            <table>
                <caption className={'f4 darkRed bold pb3'}>Banking Transactions</caption>
                <thead>
                <tr>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('date')}
                            className={getClassNamesFor('date')}
                        >
                            Date
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('type')}
                            className={getClassNamesFor('type')}
                        >
                            Type
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('amount')}
                            className={getClassNamesFor('amount')}
                        >
                            Amount
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>

                {items.map( (item) => (
                    <tr key={item._id}>
                        <td>{DateFromInt(item.date)}</td>
                        <td>{item.type}</td>
                        <td>${item.amount.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            }


        </>
    );
};

export default Table;