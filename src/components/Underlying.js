import React, { useEffect, useState, useRef } from 'react';
import Banking from './Banking'
import AddUnderlying from './AddUnderlying'
import EditUnderlying from './EditUnderlying'
import Table from './Table'
import useAuth from '../helpers/useAuth'
import useUnderlyingQuery from "../queries/useUnderlyingQuery";

const Underlying = () => {

    const auth = useAuth()
    const userId = auth.user._id
    const [optionQueryVars, setOptionQueryVars] = useState( { input: { userId: userId, open: true } } )
    const { data, refetch } = useUnderlyingQuery({ variables: optionQueryVars });
    const [underlyingTableData, setOptionTableData] = useState([])

    const [ showAddForm, setShowAddForm ] = useState(false);
    const [ showEditForm, setShowEditForm ] = useState(false);
    const [ position, setPositionState ] = useState({} )
    const [ underlyingFormButtonText, setUnderlyingFormButtonText ] = useState("Add Underlying Trade");

    const setPosition = ( id ) => {
        const matchingPositionIndex = underlyingTableData.map( ( item ) => {
            return item._id
        }).indexOf( id )
        setPositionState( underlyingTableData[matchingPositionIndex] )
    }

    const formatDataForTable = ( data ) => {
        const resultData = []
        data.forEach( trade => {
            resultData.push( trade )
        })
        setOptionTableData( resultData )
    }

    useEffect(() => {
        if( data !== undefined ) {
            formatDataForTable( data.getUnderlying )
        }
    },[ data ] )

    const showForm = ( bool ) => {
        if( bool === false ) {
            setShowAddForm(true)
            setShowEditForm(false)
            setUnderlyingFormButtonText("Hide Form")
        } else {
            setShowAddForm(false)
            setUnderlyingFormButtonText("Add Underlying Trade")
        }
    }

    return (
        <div className={"appPage w-100"}>
            <h3 className={"f3"}>Underlying Positions</h3>

            { ! showEditForm &&
            <button onClick={() => showForm(showAddForm)} className={'ml3 pa3 add'}>
                {underlyingFormButtonText} </button> }

            { showAddForm && ! showEditForm &&
                <AddUnderlying
                    underlyingTrades={underlyingTableData}
                    refetch={refetch} /> }

            { showEditForm &&
                <EditUnderlying
                    position={ position }
                    setShowEditForm={ setShowEditForm } /> }

            <div>
                    <>
                        <Table
                            data={ underlyingTableData }
                            userId={ userId }
                            tableType={"allUnderlying"}
                            refetch={ refetch }
                            setDataVariables={ setOptionQueryVars }
                            setEditForm={ setShowEditForm }
                            setElement={ setPosition } />
                    </>
            </div>

            <Banking />

        </div>
    );
};

export default Underlying;