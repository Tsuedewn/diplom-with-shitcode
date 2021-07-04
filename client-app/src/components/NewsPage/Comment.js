import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    cardHeader: {
        backgroundColor: theme.palette.grey[200],
        height: 20,
        fontSize: 10
    },

    card: {
        width: 600,
        margin: '20px auto 0 auto'
    },

    card_content: {
        paddingTop: 0,
        paddingBottom: "10px !important",
        height: "auto"
    }
}));


export default function Comment({text, user_login, user_id, date}) {
    const classes = useStyles();

    const tier = {
        title: user_login,
        subheader: date,
        description: text
    }

    const link = <Link style={{
        textDecoration: "none",
        color: "gray",
        fontSize: 20
    }} to={`/profile/${user_id}`}>{tier.title}</Link>

    return (
        <Card className={classes.card}>
            <CardHeader
                title={link}
                titleTypographyProps={{ align: 'left' }}
                className={classes.cardHeader}
            />
            <CardContent className={classes.card_content}>
                <p style={{marginBottom: 0}}>
                    {tier.description}
                </p>
                <p style={{textAlign: 'right', color: 'gray', margin: "10px 0 0 0"}}>
                    {tier.subheader}
                </p>
            </CardContent>
        </Card>
    );
}