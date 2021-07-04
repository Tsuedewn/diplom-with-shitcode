import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import { Link } from 'react-router-dom';
import {AccountCircle, BurstMode, CameraRoll, MailOutline} from "@material-ui/icons";
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';

const useStyles = makeStyles({
    root: {
        width: 500,
        margin: "0 auto",
    },
});

const SimpleBottomNavigation = observer(() => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const {user} = useContext(Context)

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes.root}
        >
            <BottomNavigationAction component={Link} to="/news" label="Лента" icon={<CameraRoll/>} />
            {user.isAuth ?
                <BottomNavigationAction component={Link} to="/profile" label="Профиль" icon={<AccountCircle/>} />
                :
                <BottomNavigationAction component={Link} to="/auth" label="Логин" icon={<EnhancedEncryptionIcon/>} />}
            {user.isAuth ?
                <BottomNavigationAction component={Link} to="/projects" label="Проекты" icon={<BurstMode/>} /> : null}
            {user.isAuth ?
                <BottomNavigationAction component={Link} to="/messages" label="Сообщения" icon={<MailOutline/>} /> : null}
        </BottomNavigation>
    );
})

export default SimpleBottomNavigation
