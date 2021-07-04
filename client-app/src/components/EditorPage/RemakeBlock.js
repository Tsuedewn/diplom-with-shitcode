import React, {useState} from 'react';
import {
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, FormControlLabel,
    FormLabel, Radio,
    RadioGroup,
    TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {$authHost} from "../../http";

const RemakeBlock = ({open, handleClose, block_id, changeBlockName, editBlockId, changeBlockType}) => {
    const [value, setValue] = React.useState('Описание');
    const [name, setName] = useState('')

    const [actor, setActor] = useState('')
    const [text, setText] = useState('')

    const [speechCount, setSpeechCount] = useState(1)
    const [data, setData] = useState([])

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

    const handleChange = (event) => {
        setText('')
        setActor('')
        setData([])
        setSpeechCount(1)
        setValue(event.target.value);
    };

    const remakeDialog = async () => {
        handleClose()
        let response = await $authHost.post(`api/editor/editDialog`, {
            data,
            name,
            block_id,
            block_type: 'dialog'
        })
        setData([])
        setSpeechCount(1)
        setName('')
        editBlockId()
        changeBlockName(block_id, response.data.block_name)
        changeBlockType(block_id, 'dialog')
    }

    const remakeMonolog = async () => {
        handleClose()
        let response = await $authHost.post(`api/editor/editOldMonolog`, {
            text,
            name,
            actor,
            block_id,
            block_type: 'monolog'
        })
        setText('')
        setActor('')
        setName('')
        editBlockId()
        changeBlockName(block_id, response.data.block_name)
        changeBlockType(block_id, 'monolog')
    }

    const remakeDescription = async () => {
        handleClose()
        let response = await $authHost.post(`api/editor/editOldMonolog`, {
            text,
            name,
            actor: "description",
            block_id,
            block_type: 'description'
        })
        setText('')
        setActor('')
        setName('')
        editBlockId()
        changeBlockName(block_id, response.data.block_name)
        changeBlockType(block_id, 'description')
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Пересоздание блока
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    style={{display: 'block'}}
                    id="outlined-basic"
                    label="Название блока"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <FormControl component="fieldset" style={{marginTop: 16, display: 'block'}}>
                    <FormLabel component="legend">Вид блока</FormLabel>
                    <RadioGroup aria-label="Вид блока" name="gender1" value={value} onChange={handleChange}>
                        <FormControlLabel value="Монолог" control={<Radio />} label="Монолог" />
                        <FormControlLabel value="Диалог" control={<Radio />} label="Диалог" />
                        <FormControlLabel value="Описание" control={<Radio />} label="Описание" />
                    </RadioGroup>
                </FormControl>
                {value === 'Описание' && <>
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
                </>}
                {value === 'Монолог' && <>
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
                </>}
                {value === 'Диалог' && <>
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
                </>}
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="primary" onClick={() => {
                    if (value === 'Монолог') {
                        remakeMonolog()
                    } else if (value === 'Описание') {
                        remakeDescription()
                    } else {
                        remakeDialog()
                    }
                }}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemakeBlock;