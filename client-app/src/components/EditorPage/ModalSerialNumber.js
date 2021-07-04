import React, {useState} from 'react';
import {DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {$authHost} from "../../http";
import Dialog from "@material-ui/core/Dialog";
import Swal from "sweetalert2";

const ModalSerialNumber = ({handleClose, open, block_id, refreshBlocks, editBlockId}) => {
    const [newNumber, setNewNumber] = useState('')

    const handler = async () => {
        handleClose()
        if (newNumber === '') {
            Swal.fire('Вы ничего не ввели!')
            editBlockId()
        } else if (isNaN(Number(newNumber))) {
            Swal.fire('Вы ввели не число!')
        } else {
            const response = await $authHost.post(`api/editor/changeSerialNumber`, {block_id, newNumber: +newNumber + 1})
            Swal.fire(response.data)
            setNewNumber('')
            refreshBlocks()
            editBlockId()
        }
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Изменение порядкового номера
            </DialogTitle>
            <DialogContent dividers>
                <p style={{marginTop: 0, width: 500}}>Задайте номер блока, после которого должен идти текущий блок. Если хотите поместить в начало, введите 0</p>
                <form id="form">
                    <TextField
                        style={{display: 'block'}}
                        id="outlined-basic"
                        label="Новый номер"
                        variant="outlined"
                        value={newNumber}
                        onChange={(e) => setNewNumber(e.target.value)}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="primary" onClick={handler}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalSerialNumber;