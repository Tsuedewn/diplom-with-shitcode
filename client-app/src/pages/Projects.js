import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {$authHost, $host} from "../http";
import Project from "../components/NewsPage/Project";
import Button from "@material-ui/core/Button";
import Swal from "sweetalert2";

const Projects = () => {
    const {user: currentUser} = useContext(Context)
    const [projects, setProjects] = useState([])

    useEffect(() => {
        (async () => {
            let response = await $host.get(`api/news/getUserProjects?id=${currentUser.user.id}`)
            response = response.data.map((item) => {
                item.updatedAt = item.updatedAt.slice(0, 10).replace('-', '.').replace('-', '.')
                return item
            })
            setProjects(response)
        })()
    }, [])

    const createProject = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Введите данные проекта',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Название">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Жанр">' +
                '<textarea id="swal-input3" class="swal2-textarea" placeholder="Описание">',
            focusConfirm: false,
            preConfirm: async () => {
                const [name, genre, description] = [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ]

                if (!(name && genre && description)) {
                    return "Не все поля заполнены!"
                } else if (name.length > 250 || genre.length > 250) {
                    return 'Жанр или название должно быть короче!'
                } else {
                    let response = await $authHost.post(`api/news/createNewProject`, {
                        name,
                        description,
                        genre,
                        user_id: currentUser.user.id
                    })
                    response.data.updatedAt = response.data.updatedAt.slice(0, 10).replace('-', '.').replace('-', '.')
                    await setProjects([
                        response.data,
                        ...projects
                    ])
                    return 'Проект успешно создан'
                }
            }
        })

        if (formValues) {
            Swal.fire(JSON.stringify(formValues))
        }
    }

    const deleteCurrentProject = (id) => {
        const newProjectList = [...projects]
        for (let key in newProjectList) {
            if (newProjectList[key].id === id) {
                newProjectList.splice(Number(key), 1)
                break
            }
        }
        setProjects(newProjectList)
    }

    return (
        <div>
            <Button fullWidth variant="contained" color="primary" style={{
                display: 'block',
                margin: '40px auto',
                width: 350
            }} onClick={createProject}>
                Создать проект
            </Button>
            {projects.map(project =>
                <Project
                    key={project.id}
                    name={project.name}
                    genre={project.genre}
                    author={null}
                    description={project.description}
                    date={project.updatedAt}
                    project_id={project.id}
                    deleteCurrentProject={deleteCurrentProject}
                />
            )}
        </div>
    );
};

export default Projects;