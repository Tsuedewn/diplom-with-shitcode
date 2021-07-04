import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import UnsubscribeButton from "./UnsubscribeButton";
import {$authHost} from "../../http";
import {Link} from "react-router-dom"

const useStyles = makeStyles({
    table: {
        minWidth: 400,
        width: 400
    },
});

function createData(name, value) {
    return {name, value};
}

const Subscribes = () => {
    const classes = useStyles()
    const [subscribes, setSubscribes] = useState([])

    useEffect(() => {
        (async () => {
            const response = await $authHost.get('api/user/getSubscribes')
            setSubscribes(response.data)
        })()
    }, [])

    const deleteSubscribe = (id) => {
        const newSubscribeList = [...subscribes]
        for (let key in newSubscribeList) {
            if (newSubscribeList[key].user.id === id) {
                newSubscribeList.splice(Number(key), 1)
                break
            }
        }
        setSubscribes(newSubscribeList)
    }

    const createButton = (id, deleteSubscribe) => {
        return <UnsubscribeButton id={id} deleteSubscribe={deleteSubscribe}/>
    }

    const rows = []
    for (let subscribe in subscribes) {
        rows.push(createData(subscribes[subscribe].user.login,
                  createButton(subscribes[subscribe].user.id, deleteSubscribe)))
    }

    return (
        <div>
            <h3 style={{textAlign: "center", fontWeight: "normal"}}>
                {rows.length ? "Подписки" : "У вас пока нет подписок"}
            </h3>
            <TableContainer component={Paper} style={{maxHeight: 330, overflow: 'auto', border: '1px solid silver'}}>
                <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    <Link style={{
                                        textDecoration: "none",
                                        color: "black",
                                        fontSize: 30
                                    }} to={`/profile/${subscribes[i].user.id}`}>{row.name}</Link>
                                </TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Subscribes