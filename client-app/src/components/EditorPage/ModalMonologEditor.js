import React, {useEffect, useState} from 'react';
import {DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {$authHost} from "../../http";

const ModalMonologEditor = ({handleClose, open, block_id, changeBlockName, editBlockId}) => {
    const [actor, setActor] = useState('')
    const [text, setText] = useState('')
    const [name, setName] = useState('')

    useEffect(async () => {
        const response = await $authHost.get(`api/editor/getBlockInfo?id=${block_id}`)
        if (!response.data.sas) {
            setName(response.data[0])
            setActor(response.data[1][0].actor)
            setText(response.data[1][0].text)
        }
    }, [block_id])

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Редактирование блока
            </DialogTitle>
            <DialogContent dividers>
                <form id="form">
                    <TextField
                        style={{display: 'block'}}
                        id="outlined-basic"
                        label="Название блока"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        style={{display: 'block', marginTop: 16}}
                        id="outlined-basic"
                        label="Повествующее лицо"
                        value={actor}
                        onChange={(e) => setActor(e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        style={{marginTop: 16}}
                        id="outlined-multiline-static"
                        label="Тест"
                        multiline
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        variant="outlined"
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={async () => {
                    handleClose()
                    let response = await $authHost.post(`api/editor/editMonolog`, {
                        name,
                        actor,
                        text,
                        block_id
                    })
                    setName('')
                    setActor('')
                    setText('')
                    editBlockId()
                    changeBlockName(block_id, response.data.block_name)
                }} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalMonologEditor;