import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {$authHost} from "../../http";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const UnsubscribeButton = ({id, deleteSubscribe}) => {
    const classes = useStyles();

    const unsubscribe = async () => {
        let response = await $authHost.post(`api/user/unsubscribe`, {id: id})
        deleteSubscribe(id)
        console.log(response.data)
    }

    return (
        <div className={classes.root}>
            <Button variant="contained" color="secondary" href="#contained-buttons" onClick={unsubscribe}>
                Отписаться
            </Button>
        </div>
    );
};

export default UnsubscribeButton;