import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {$authHost} from "../../http";

export default function ModalDescription({open, handleClose, addBlock, project_id}) {
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const actor = 'description'

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Создание блока
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
                        style={{marginTop: 16}}
                        id="outlined-multiline-static"
                        label="Текст"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={async () => {
                    handleClose()
                    let response = await $authHost.post(`api/editor/createNewMonolog`, {
                        text,
                        name,
                        actor,
                        project_id,
                        block_type: 'description'
                    })
                    setText('')
                    setName('')
                    addBlock(response.data)
                }} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}