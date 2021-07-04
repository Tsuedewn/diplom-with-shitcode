import '../../css/theme.css';
import React, {useEffect, useState} from 'react';
import {$authHost} from "../../http";
import Button from "@material-ui/core/Button";
import Swal from "sweetalert2";
import ModalDialogEditor from "./ModalDialogEditor";
import RemakeBlock from "./RemakeBlock";
import ModalMonologEditor from "./ModalMonologEditor";
import ModalDescriptionEditor from "./ModalDescriptionEditor";
import ModalAttach from "./ModalAttach";
import ModalAttachSong from "./ModalAttachSong";
import ModalSerialNumber from "./ModalSerialNumber";

const BlockList = ({blocks, deleteCurrentBlock, changeBlockName, changeBlockType, refreshBlocks}) => {
    const deleteProject = (id) => {
        const result = Swal.fire({
            title: 'Вы уверены?',
            text: "Удаленный блок нельзя восстановить!" + id,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Удалено!',
                    'Ваш блок удален.',
                    'success'
                )
                $authHost.post(`api/editor/deleteBlock`, {id})
                deleteCurrentBlock(id)
            }
        })
    }

    const [openDescription, setOpenDescription] = React.useState(false);
    const [openMonolog, setOpenMonolog] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openRemake, setOpenRemake] = React.useState(false);
    const [openAttach, setOpenAttach] = React.useState(false);
    const [openSerial, setOpenSerial] = React.useState(false);
    const [openAttachSong, setOpenAttachSong] = React.useState(false);
    const [currentId, setCurrentId] = React.useState(0)

    const editBlockId = () => {
        setCurrentId(0)
    }

    const handleCloseDescription = () => {
        setOpenDescription(false);
    };

    const handleCloseRemake = () => {
        setOpenRemake(false);
    };

    const handleClickOpenDescription = (id) => {
        setCurrentId(id)
        setOpenDescription(true)
    }

    const handleClickOpenRemake = (id) => {
        setCurrentId(id)
        setOpenRemake(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClickOpenDialog = (id) => {
        setCurrentId(id)
        setOpenDialog(true)
    }

    const handleCloseMonolog = () => {
        setOpenMonolog(false);
    };

    const handleClickOpenMonolog = (id) => {
        setCurrentId(id)
        setOpenMonolog(true)
    }

    const handleClickOpenAttach = (id) => {
        setCurrentId(id)
        setOpenAttach(true)
    }

    const handleCloseAttach = () => {
        setOpenAttach(false);
    };

    const handleClickOpenAttachSong = (id) => {
        setCurrentId(id)
        setOpenAttachSong(true)
    }

    const handleCloseAttachSong = () => {
        setOpenAttachSong(false);
    };

    const handleClickOpenSerial = (id) => {
        setCurrentId(id)
        setOpenSerial(true)
    }

    const handleCloseSerial = () => {
        setOpenSerial(false);
    };

    return (
        <div>
            <ModalDialogEditor
                changeBlockName={changeBlockName}
                open={openDialog}
                handleClose={handleCloseDialog}
                block_id={currentId}
                editBlockId={editBlockId}
            />
            <ModalMonologEditor
                changeBlockName={changeBlockName}
                open={openMonolog}
                handleClose={handleCloseMonolog}
                block_id={currentId}
                editBlockId={editBlockId}
            />
            <ModalDescriptionEditor
                changeBlockName={changeBlockName}
                open={openDescription}
                handleClose={handleCloseDescription}
                block_id={currentId}
                editBlockId={editBlockId}
            />
            <RemakeBlock
                editBlockId={editBlockId}
                changeBlockName={changeBlockName}
                changeBlockType={changeBlockType}
                open={openRemake}
                handleClose={handleCloseRemake}
                block_id={currentId}
            />
            <ModalAttach
                editBlockId={editBlockId}
                open={openAttach}
                handleClose={handleCloseAttach}
                block_id={currentId}
            />
            <ModalAttachSong
                editBlockId={editBlockId}
                open={openAttachSong}
                handleClose={handleCloseAttachSong}
                block_id={currentId}
            />
            <ModalSerialNumber
                editBlockId={editBlockId}
                refreshBlocks={refreshBlocks}
                open={openSerial}
                handleClose={handleCloseSerial}
                block_id={currentId}
            />
            {blocks.map((i) => {
                return <div key={i.id}>
                    <hr style={{marginTop: 40}}/>
                    <h1 style={{textAlign: "center"}}>{i.serial_number}) {i.block_name}</h1>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Button id={i.id} style={{width: 170}} variant="contained" color="primary"
                        onClick={() => {
                            if (i.block_type === 'dialog') {
                                handleClickOpenDialog(i.id)
                            } else if (i.block_type === 'monolog') {
                                handleClickOpenMonolog(i.id)
                            } else {
                                handleClickOpenDescription(i.id)
                            }
                        }}>
                            Редактировать
                        </Button>
                        <Button id={i.id} style={{width: 120}} variant="outlined" color="primary"
                            onClick={() => handleClickOpenRemake(i.id)}
                        >
                            Пересоздать блок
                        </Button>
                        <Button id={i.id} style={{width: 120}} variant="outlined" color="primary"
                                onClick={() => handleClickOpenSerial(i.id)}
                        >
                            Изменить номер
                        </Button>
                        <Button style={{width: 110}} variant="contained" color="secondary"
                                onClick={() => deleteProject(i.id)}>
                            Удалить
                        </Button>
                    </div>
                    <div style={{marginTop: 20, display: "flex", justifyContent: "space-between"}}>
                        <Button id={i.id} style={{width: 270}} variant="contained" color="primary"
                                onClick={() => handleClickOpenAttach(i.id)}
                        >
                            Редактировать картинки раскадровки
                        </Button>
                        <Button style={{width: 270}} variant="contained" color="secondary"
                                onClick={() => handleClickOpenAttachSong(i.id)}
                        >
                            Изменить саунд-трек
                        </Button>
                    </div>
                </div>
            })}
        </div>
    );
};

export default BlockList;