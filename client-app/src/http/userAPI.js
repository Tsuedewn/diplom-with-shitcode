import {$authHost, $host} from "./index";
import jwtDecode from "jwt-decode";

export const registration = async (name, email, login, password) => {
    const {data} = await $host.post('api/user/registration', {name, email, login, password})
    if (data.token) {
        localStorage.setItem('token', data.token)
        return jwtDecode(data.token)
    }
    return data
}

export const logIn = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    if (data.token) {
        localStorage.setItem('token', data.token)
        return jwtDecode(data.token)
    }
    return data
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/isAuth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}