import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import CommentList from "../components/NewsPage/CommentList";
import Project from "../components/NewsPage/Project";
import {$host} from "../http";
import Block from "../components/NewsPage/Block";
import '../css/block.css'
import {Icon} from "@material-ui/core";

const SomeProject = () => {
    const params = useParams()
    const [project, setProject] = useState({user: {}})
    const [currentBlock, setCurrentBlock] = useState(1)
    const [blockCount, setBlockCount] = useState(0)

    useEffect(async () => {
        let response = await $host.get(`api/news/getProject?id=${params.id}`)
        const project = response.data
        project.updatedAt = project.updatedAt.slice(0, 10).replace('-', '.').replace('-', '.')
        setProject(project)

        response = await $host.get(`api/news/getBlockCount?id=${params.id}`)
        setBlockCount(response.data)
    }, [])

    let controls = []
    for (let i = 1; i <= blockCount; i++) {
        if (i === currentBlock) {
            controls.push(<p
                className="selector"
                style={{background: '#3f51b5'}}
                onClick={() => setCurrentBlock(i)}
            >
                {i}
            </p>)
        } else {
            controls.push(<p
                className="selector"
                onClick={() => setCurrentBlock(i)}
            >
                {i}
            </p>)
        }
    }

    return (
        <>
            <Project
                author={project.user.login}
                date={project.updatedAt}
                genre={project.genre}
                name={project.name}
                description={project.description}
                author_id={project.user_id}
                project_id={params.id}
                width={900}
            />
            {blockCount === 0 ?
                <h1 style={{textAlign: 'center'}}>Данный проект пока пуст</h1>
                :
                <div className="player">
                    <div className="controls">
                        {currentBlock !== 1 ?
                            <Icon style={{fontSize: 100}} className="arrow" onClick={() => setCurrentBlock(currentBlock - 1)}>arrow_left</Icon>
                            :
                            <Icon style={{fontSize: 100, visibility: 'hidden'}} className="arrow">arrow_left</Icon>
                        }
                        <Block block_count={currentBlock} project_id={params.id}/>
                        {currentBlock !== blockCount ?
                            <Icon style={{fontSize: 100}} className="arrow" onClick={() => setCurrentBlock(currentBlock + 1)}>arrow_right</Icon>
                            :
                            <Icon style={{fontSize: 100, visibility: 'hidden'}} className="arrow">arrow_right</Icon>
                        }
                    </div>
                    <div className="select">
                        {controls.map(control => control)}
                    </div>
                </div>
            }
            <CommentList project_id={params.id}/>
        </>
    )
}

export default SomeProject