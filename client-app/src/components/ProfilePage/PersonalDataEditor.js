import React, {useContext, useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {Context} from "../../index";
import Swal from "sweetalert2";
import {$authHost} from "../../http";
import jwtDecode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        width: 200,
        margin: theme.spacing(3, 0, 2),
    },
}));

const PersonalDataEditor = () => {
    const classes = useStyles();
    const {user} = useContext(Context)

    const [email, setEmail] = useState('')
    const [login, setLogin] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault()
        let response = await $authHost.post('api/user/updateInfo', {
            email, login, oldPassword, newPassword
        })
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            let newUserObject = jwtDecode(response.data.token)
            user.setUser(newUserObject)
            setEmail(''); setLogin(''); setOldPassword(''); setNewPassword('')
            await Swal.fire("Изменения прошли успешно!")
        } else {
            await Swal.fire(response.data)
        }
    }

    return (
        <form className={classes.form}
              noValidate
              onSubmit={submitHandler}>
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Изменить контакт"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
            />
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="login"
                label="Изменить логин"
                value={login}
                onChange={e => setLogin(e.target.value)}
                id="login"
            />
            <hr/>
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="oldPassword"
                type="password"
                label="Введите старый пароль"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                id="oldPassword"
            />
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="password"
                name="newPassword"
                label="Введите новый пароль"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                id="newPassword"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                style={{display: "block", margin: "15px auto"}}
            >
                Изменить данные
            </Button>
        </form>
    );
}

export default PersonalDataEditor