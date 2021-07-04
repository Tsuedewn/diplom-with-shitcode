import React, {useContext, useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {registration, logIn} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {useHistory} from "react-router-dom";
import Swal from "sweetalert2";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Auth = observer(() => {
    const {user} = useContext(Context)
    const history = useHistory()

    const classes = useStyles();
    const [block, setBlock] = useState('SingIn')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [login, setLogin] = useState('')

    const toNull = () => {
        setPassword('')
        setName('')
        setLogin('')
        setEmail('')
    }

    const click = async (isLogin) => {
        let data
        if (isLogin) {
            data = await logIn(email, password)
            toNull()
        } else {
            data = await registration(name, email, login, password)
            toNull()
        }

        if (data.login) {
            user.setUser(data)
            user.setIsAuth(true)
            history.push('/profile')
        } else {
            await Swal.fire(data)
        }
    }

    const singInBlock = <div className={classes.paper}>
        <Typography component="h1" variant="h5">
            Войти
        </Typography>
        <form className={classes.form} noValidate onSubmit={(e) => {e.preventDefault(); click(true)}}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Логин"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Войти
            </Button>
            <Grid container>
                <Grid item>
                    <span style={{color: "blue", cursor: "pointer"}} variant="body2" onClick={e => {setBlock('SingUn'); toNull()}}>
                        {"Нет аккаунта? Зарегистрироваться"}
                    </span>
                </Grid>
            </Grid>
        </form>
    </div>

    const singUpBlock = <div className={classes.paper}>
        <Typography component="h1" variant="h5">
            Зарегистрироваться
        </Typography>
        <form className={classes.form} noValidate onSubmit={(e) => {e.preventDefault(); click(false)}}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        autoComplete="fname"
                        name="firstName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="Имя"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Логин"
                        name="lastName"
                        autoComplete="lname"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Контакт"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Подтвердить
            </Button>
            <Grid container justify="flex-end">
                <Grid item>
                    <span style={{color: "blue", cursor: "pointer"}} variant="body2" onClick={e => {setBlock('SingIn'); toNull()}}>
                        Есть аккаунт? Войти
                    </span>
                </Grid>
            </Grid>
        </form>
    </div>

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            {block === 'SingIn' ? singInBlock : singUpBlock}
        </Container>
    );
})

export default Auth