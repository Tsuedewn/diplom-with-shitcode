import React, {useState} from 'react';
import {DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {$authHost} from "../../http";

const ModalMonolog = ({handleClose, open, addBlock, project_id}) => {
    const [actor, setActor] = useState('')
    const [text, setText] = useState('')
    const [name, setName] = useState('')

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
                        style={{display: 'block', marginTop: 16}}
                        id="outlined-basic"
                        label="Повествующее лицо"
                        variant="outlined"
                        value={actor}
                        onChange={(e) => setActor(e.target.value)}
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
                        block_type: 'monolog'
                    })
                    setText('')
                    setActor('')
                    setName('')
                    addBlock(response.data)
                }} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalMonolog;