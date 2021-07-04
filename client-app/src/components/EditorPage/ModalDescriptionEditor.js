import React, {useEffect, useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import {DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {$authHost} from "../../http";

const ModalDescriptionEditor = ({handleClose, open, block_id, changeBlockName, editBlockId}) => {
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const actor = 'description'

    useEffect(async () => {
        const response = await $authHost.get(`api/editor/getBlockInfo?id=${block_id}`)
        if (!response.data.sas) {
            setName(response.data[0])
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
                        style={{marginTop: 16}}
                        id="outlined-multiline-static"
                        label="Тест"
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
                    let response = await $authHost.post(`api/editor/editMonolog`, {
                        name,
                        actor,
                        text,
                        block_id
                    })
                    setName('')
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

export default ModalDescriptionEditor;