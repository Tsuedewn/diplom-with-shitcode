import React, {useContext, useEffect, useState} from 'react';
import '../css/profile.css'
import DataTable from "../components/ProfilePage/DataTable";
import CommunicationControls from "../components/ProfilePage/CommunicationСontrols";
import {useHistory, useParams} from 'react-router-dom'
import {$host} from "../http";
import {Context} from "../index";
import Project from "../components/NewsPage/Project";


const SomeProfile = () => {
    const history = useHistory()
    const {user: currentUser} = useContext(Context)
    const params = useParams()
    const [user, setUser] = useState({user: {email: 'Загрузка...', login: 'Загрузка...'}})
    const [projects, setProjects] = useState([])

    useEffect(() => {
        if (Number(currentUser.user.id) === Number(params.id)) {
            history.push('/profile')
        } else {
            (async () => {
                let response = await $host.get(`api/user/getUser?id=${params.id}`)
                setUser({user: {email: response.data.email, login: response.data.login}})

                response = await $host.get(`api/news/getUserProjects?id=${params.id}`)
                response = response.data.map((item) => {
                    item.updatedAt = item.updatedAt.slice(0, 10).replace('-', '.').replace('-', '.')
                    return item
                })
                setProjects(response)
            })()
        }
    }, [currentUser.user.id])


    return (
        <div className="profile_cart">
            <DataTable user={user}/>
            {currentUser.isAuth ? <CommunicationControls id={params.id}/> : null}
            {projects.map(project =>
                <Project
                    genre={project.genre}
                    key={project.id}
                    name={project.name}
                    author={null}
                    description={project.description}
                    date={project.updatedAt}
                    project_id={project.id}
                />
            )}
        </div>
    );
}

export default SomeProfile;