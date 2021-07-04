import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {$authHost} from "../../http";
import Swal from "sweetalert2";

const CommunicationControls = ({id}) => {
    const [buttonState, setButtonState] = useState(true);
    const [message, setMessage] = useState('')

    const sendMessage = async (e) => {
        e.preventDefault()
        await $authHost.post(`api/chat/sendMessage`, {id: id, text: message})
        setMessage('')
        await Swal.fire('Сообщение успешно отправлено!')
    }

    const subscribe = async () => {
        let response = await $authHost.post(`api/user/subscribe`, {id: id})
        console.log(response.data)
        setButtonState(!buttonState)
    }

    const unsubscribe = async () => {
        let response = await $authHost.post(`api/user/unsubscribe`, {id: id})
        console.log(response.data)
        setButtonState(!buttonState)
    }

    useEffect(() => {
        (async () => {
            let response = await $authHost.post(`api/user/checkSubscribe`, {id: id})
            setButtonState(response.data)
        })()
    }, [])

    return (
        <>
            <Button onClick={buttonState ? subscribe : unsubscribe}
                    variant={buttonState ? "contained" : "outlined"} color="secondary" style={{
                display: "block",
                margin: "30px auto"
            }}>
                {buttonState ? "Подписаться" : "Отписаться"}
            </Button>
        </>
    );
}

export default CommunicationControls;