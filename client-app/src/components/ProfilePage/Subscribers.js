import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {observer} from "mobx-react-lite";
import {$authHost} from "../../http";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    table: {
        minWidth: 400,
        width: 400
    },
});

function createData(name, value) {
    return {name, value};
}

const Subscribers = observer(() => {
    const classes = useStyles();
    const [subscribers, setSubscribers] = useState([])

    useEffect(() => {
        (async () => {
            const response = await $authHost.get('api/user/getSubscribers')
            setSubscribers(response.data)
        })()
    }, [])

    const rows = []
    for (let subscriber in subscribers) {
        rows.push(createData(subscribers[subscriber].login))
    }

    return (
        <div>
            <h3 style={{textAlign: "center", fontWeight: "normal"}}>
                {rows.length ? "Подписчики" : "У вас пока нет подписчиков"}
            </h3>
            <TableContainer component={Paper} style={{maxHeight: 330, overflow: 'auto', border: '1px solid silver'}}>
                <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row" align="center">
                                    <Link style={{
                                        textDecoration: "none",
                                        color: "black",
                                        fontSize: 30
                                    }} to={`/profile/${subscribers[i].id}`}>{row.name}</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
})

export default Subscribers