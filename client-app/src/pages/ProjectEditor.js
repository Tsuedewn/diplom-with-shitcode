import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Swal from "sweetalert2";
import {$authHost, $host} from "../http";
import ModalDescription from "../components/EditorPage/ModalDescription"
import ModalDialog from "../components/EditorPage/ModalDialog";
import ModalMonolog from "../components/EditorPage/ModalMonolog";
import BlockList from "../components/EditorPage/BlockList";

const buttonStyles = {
    marginTop: 40
}

const ProjectEditor = () => {
    const params = useParams()

    const editProject = async () => {
        let response = await $authHost.get(`api/news/getProjectCart?id=${params.id}`)
        let {name, genre, description} = response.data
        const {value: formValues} = await Swal.fire({
            title: 'Введите новые данные проекта',
            html:
                `<input id="swal-input1" value="${name}" class="swal2-input" placeholder="Название">` +
                `<input id="swal-input2" value="${genre}" class="swal2-input" placeholder="Жанр">` +
                `<textarea id="swal-input3" class="swal2-textarea" placeholder="Описание">${description}` +
                `</textarea>`,
            focusConfirm: false,
            preConfirm: async () => {
                const [newName, newGenre, newDescription] = [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ]

                if (!(newName && newGenre && newDescription)) {
                    return 'Не все поля заполнены!'
                }
                if (newName === name && newGenre === genre && newDescription === description) {
                    return 'Не найдено изменений в данных'
                } else {
                    let response = await $authHost.post(`api/news/updateProjectCart`, {
                        id: params.id,
                        name: newName,
                        genre: newGenre,
                        description: newDescription
                    })
                    console.log(response.data)
                    return 'Данные изменены'
                }
            }
        })

        if (formValues) {
            Swal.fire(JSON.stringify(formValues))
        }
    }

    const [openDescription, setOpenDescription] = React.useState(false);
    const [openMonolog, setOpenMonolog] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [blocks, setBlocks] = useState([])
    const [isUpdated, updateBlocks] = useState(false)

    useEffect(async () => {
        const response = await $authHost.get(`api/editor/getProjectBlocks?id=${params.id}`)
        setBlocks(response.data)
    }, [isUpdated])

    const refreshBlocks = () => {
        updateBlocks(!isUpdated)
    }

    const addBlock = (block) => {
        let newBlocks = [...blocks]
        console.log(block)
        newBlocks.push(block)
        setBlocks(newBlocks)
    }

    const handleCloseDescription = () => {
        setOpenDescription(false);
    };

    const handleClickOpenDescription = () => {
        setOpenDescription(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClickOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseMonolog = () => {
        setOpenMonolog(false);
    };

    const handleClickOpenMonolog = () => {
        setOpenMonolog(true)
    }

    const deleteCurrentBlock = (id) => {
        const newBlockList = [...blocks]
        for (let key in newBlockList) {
            if (newBlockList[key].id === id) {
                newBlockList.splice(Number(key), 1)
                break
            }
        }
        setBlocks(newBlockList)
    }

    const changeBlockName = (id, name) => {
        const newBlockList = [...blocks]
        for (let key in newBlockList) {
            if (newBlockList[key].id === id) {
                newBlockList[key].block_name = name
                break
            }
        }
        setBlocks(newBlockList)
    }

    const changeBlockType = (id, type) => {
        const newBlockList = [...blocks]
        for (let key in newBlockList) {
            if (newBlockList[key].id === id) {
                newBlockList[key].block_type = type
                break
            }
        }
        setBlocks(newBlockList)
    }

    return (
        <div style={{width: 600, margin: "0 auto", paddingBottom: 40}}>
            <Button onClick={editProject} style={buttonStyles} fullWidth variant="contained" color="primary">
                Редактировать карточку проекта
            </Button>
            <div style={{display: 'flex', justifyContent: "space-between"}}>
                <Button style={{width: 150, marginTop: 40}} variant="contained" color="primary"
                        onClick={handleClickOpenDescription}>
                    Создать сценарный блок c описанием
                </Button>
                <Button style={{width: 150, marginTop: 40}} variant="contained" color="primary"
                        onClick={handleClickOpenDialog}>
                    Создать сценарный блок c диалогом
                </Button>
                <Button style={{width: 150, marginTop: 40}} variant="contained" color="primary"
                        onClick={handleClickOpenMonolog}>
                    Создать сценарный блок c монологом
                </Button>
            </div>
            <ModalDescription open={openDescription} addBlock={addBlock} handleClose={handleCloseDescription} project_id={params.id}/>
            <ModalDialog open={openDialog} addBlock={addBlock} handleClose={handleCloseDialog} project_id={params.id}/>
            <ModalMonolog open={openMonolog} handleClose={handleCloseMonolog} addBlock={addBlock} project_id={params.id}/>
            <BlockList
                blocks={blocks}
                deleteCurrentBlock={deleteCurrentBlock}
                changeBlockName={changeBlockName}
                changeBlockType={changeBlockType}
                refreshBlocks={refreshBlocks}
            />
        </div>
    );
};

export default ProjectEditor