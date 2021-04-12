import useSortableData from "../helpers/useSortableData";
import DateFromInt from '../helpers/Date';

const Table = (props) => {
    const tableType = props.tableType
    const numPositions = props.numPositions

    const { items, requestSort, sortConfig } = useSortableData(props.data);

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
                {items.map((item) => (
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
            <table>
                <caption className={'f4 darkRed bold'}>Option Positions</caption>
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
                            onClick={() => requestSort('spreads[0].legs[0].strike')}
                            className={getClassNamesFor('spreads[0].legs[0].strike')}
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
                {items.map((item) => (
                    <tr key={item._id}>
                        <td>{item.symbol}</td>
                        <td>{item.spreads[0].legs[0].qty}</td>
                        <td>{DateFromInt(item.spreads[0].legs[0].entryDate)}</td>
                        <td>${item.spreads[0].legs[0].strike}</td>
                        <td>{DateFromInt(item.spreads[0].legs[0].expirationDate)}</td>
                        <td>{item.spreads[0].legs[0].initialAroi}%</td>
                        <td>{item.spreads[0].legs[0].notes}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            }
        </>
    );
};

export default Table;