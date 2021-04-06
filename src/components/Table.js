import useSortableData from "../helpers/useSortableData";

const Table = (props) => {
    const numPositions = props.numPositions
    const { items, requestSort, sortConfig } = useSortableData(props.data);
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    return (
        <table>
            <caption className={'f4 darkRed bold'}>Open Underlying Positions: {numPositions}</caption>
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
    );
};

export default Table;