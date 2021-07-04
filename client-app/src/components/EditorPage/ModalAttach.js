import React, {useEffect, useState} from 'react';
import {
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Swal from "sweetalert2";
import {$authHost} from "../../http";

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const ModalAttach = ({open, handleClose, block_id, changeBlockName, editBlockId, changeBlockType}) => {
    let files = []
    const [isLoading, setIsLoading] = useState(false)
    const [pics, setPics] = useState(false)

    useEffect(async () => {
        const response = await $authHost.get(`api/editor/getStoryboardInfo?id=${block_id}`)
        const pics = response.data

        if (pics.length) {
            setPics(pics)
        } else {
            setPics(false)
        }

    }, [block_id])

    const triggerInput = () => document.getElementById('file').click()

    const changeHandler = (e) => {
        if (e.target.files.length === 0) {
            return null
        }

        document.getElementById('preview').innerHTML = ''
        files = Array.from(e.target.files)

        files.forEach(file => {
            const reader = new FileReader()

            reader.onload = (e) => {
                const src = e.target.result
                document.getElementById('preview').
                insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}" />
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `)
            }

            reader.readAsDataURL(file)
        })
    }

    const clearPreview = el => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }

    const onUpload = async (files) => {
        let formData = new FormData()
        formData.set('block_id', block_id)

        for (let i = 0; i < files.length; i++) {
            formData.append('imagesUp', files[i])
        }


        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        setIsLoading(true)
        const response = await $authHost.post(`api/editor/uploadFiles`, formData, config)
        handleClose()
        editBlockId(0)
        Swal.fire(response.data)
        setIsLoading(false)
    }

    const triggerUpload = async () => {
        if (files.length > 4) {
            handleClose()
            Swal.fire('Нельзя загрузить более 4-ех картинок!')
            return null
        }

        if (!files.length) {
            handleClose()
            Swal.fire('Вы ничего не загрузили!')
        } else {
            document.getElementById('preview')
                .querySelectorAll('.preview-remove')
                .forEach(e => e.remove())

            const previewInfo = document.getElementById('preview')
                .querySelectorAll('.preview-info')
            previewInfo.forEach(clearPreview)
            onUpload(files, previewInfo)
        }
    }

    const removeHandler = (e) => {
        const {name} = e.target.dataset
        files = files.filter(file => file.name !== name)

        const block = document.getElementById('preview')
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')

        block.classList.add('removing')
        setTimeout(() => block.remove(), 300)
    }

    const fullDeleteHandler = () => {
        handleClose()
        const result = Swal.fire({
            title: 'Вы уверены?',
            text: "Хотите удалить изображения раскадровки?",
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
                    'Изображения удалены.',
                    'success'
                )
                $authHost.post(`api/editor/deleteStoryboard`, {block_id})
                editBlockId(0)
            }
        })
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Прикрепление раскадровки к {block_id}
            </DialogTitle>
            <DialogContent dividers style={{width: 500}}>
                { !isLoading ? <>
                    <input
                        type="file"
                        id="file"
                        multiple={true}
                        onChange={changeHandler}
                        accept=".jpg,.jpeg,.png,.bitmap"
                    />
                    <div className="preview" id="preview" onClick={removeHandler}/>
                    <button className="btn" onClick={triggerInput}>Открыть</button>
                    <button className="btn primary" onClick={triggerUpload}>Загрузить</button>
                    { pics && <button className="btn primary red" onClick={fullDeleteHandler}>Удалить</button>}
                </> :
                    <div className="loader" id="loader">
                        <div className="loaderBar" />
                    </div>
                }
                {pics && <>
                    <hr style={{marginTop: 20}}/>
                    <h2>
                        У блока есть следующие картинки:
                    </h2>
                    {pics.map((pic => {
                        return <img
                            className="image-loaded"
                            src={`http://localhost:5000/storyboard/${pic.path}`}
                            alt={pic.path}
                            key={pic.id}
                        >
                        </img>
                    }))}
                    <h2>Если вы загрузите новые, старые изображения пропадут</h2>
                </>}
            </DialogContent>
        </Dialog>
    );
};

export default ModalAttach;