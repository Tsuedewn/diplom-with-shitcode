import React, {useEffect, useState} from 'react';
import {DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {$authHost, $host} from "../../http";

const ModalDialogEditor = ({handleClose, open, block_id, changeBlockName, editBlockId}) => {
    const [speechCount, setSpeechCount] = useState(1)
    const [data, setData] = useState([])
    const [name, setName] = useState('')

    useEffect(async () => {
        const response = await $authHost.get(`api/editor/getBlockInfo?id=${block_id}`)
        if (!response.data.sas) {
            setName(response.data[0])
            setSpeechCount(response.data[1].length)
            setData(response.data[1])
        }
    }, [block_id])

    const createFields = (count) => {
        let fields = []
        for (let i = 0; i < count; i++) {
            fields.push(<div key={i}>
                <TextField
                    style={{display: 'block', marginTop: 16}}
                    id={i + 'actor'}
                    label="Повествующее лицо"
                    variant="outlined"
                    value={data[i] ? data[i].actor : ''}
                    onChange={(e) => {
                        let newData = [...data]
                        if (newData[i]) {
                            newData[i].actor = e.target.value
                        } else {
                            newData[i] = {}
                            newData[i].actor = e.target.value
                        }
                        setData(newData)
                    }}
                />
                <TextField
                    style={{marginTop: 16}}
                    id={i + 'text'}
                    label="Текст"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={data[i] ? data[i].text : ''}
                    onChange={(e) => {
                        let newData = [...data]
                        if (newData[i]) {
                            newData[i].text = e.target.value
                        } else {
                            newData[i] = {}
                            newData[i].text = e.target.value
                        }
                        setData(newData)
                    }}
                />
            </div>)
        }
        return fields
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Редактирование блока {block_id}
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
                    {createFields(speechCount).map((i) => i)}
                    <Button fullWidth variant="contained" color="primary" style={{
                        display: 'block',
                        margin: "16px auto 0 auto",
                        width: 'auto'
                    }} onClick={() => setSpeechCount(speechCount + 1)}>
                        Добавить реплику
                    </Button>
                    {speechCount > 1 && <Button fullWidth variant="contained" color="secondary" style={{
                        display: 'block',
                        margin: "16px auto 0 auto",
                        width: 'auto'
                    }} onClick={() => {
                        setSpeechCount(speechCount - 1)
                        let newData = [...data]
                        newData.pop()
                        setData(newData)
                    }}>
                        Удалить реплику
                    </Button>}
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={async () => {
                    handleClose()
                    let response = await $authHost.post(`api/editor/editDialog`, {
                        data,
                        name,
                        block_id
                    })
                    setData([])
                    setSpeechCount(1)
                    setName('')
                    editBlockId()
                    changeBlockName(block_id, response.data.block_name)
                }} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalDialogEditor;