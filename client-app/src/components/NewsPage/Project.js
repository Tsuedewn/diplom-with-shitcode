import React, {useContext, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {Link} from "react-router-dom";
import {Context} from "../../index";
import Swal from "sweetalert2";
import {$authHost, $host} from "../../http";


const useStyles = makeStyles((theme) => ({
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },

    card: {
        width: 400,
        margin: '40px auto 40px auto'
    }
}));


export default function Project({author, date, genre, name, description, author_id, project_id, deleteCurrentProject, width}) {
    const {user} = useContext(Context)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [isInProjects, setIsInProjects] = useState(window.location.href.includes('projects'))
    const [isInProject, setIsInProject] = useState(window.location.href.includes('project/'))

    const useStyles = makeStyles((theme) => ({
        cardHeader: {
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
        },

        card: {
            width: width ? width : 400,
            margin: '40px auto 40px auto'
        }
    }));

    const classes = useStyles();

    const likeIt = async () => {
        if (user.isAuth) {
            if (liked) {
                await $authHost.post(`api/news/deleteLike`, {project_id})
                setLiked(false)
                setLikes(likes - 1)
            } else {
                await $authHost.post(`api/news/setLike`, {project_id})
                setLiked(true)
                setLikes(likes + 1)
            }
        } else {
            await Swal.fire('Вы должны быть авторизированы, чтобы поставить лайк')
        }
    }

    useEffect(() => {
        (async () => {
            let response = await $host.get(`api/news/getLikeInfo?id=${project_id}`)
            setLikes(response.data)
            if (user.isAuth) {
                let isLiked = await $authHost.get(`api/news/isLiked?id=${project_id}`)
                if (isLiked.data) {
                    setLiked(true)
                }
            }
        })()
    }, [])

    const tier = {
        title: name + ` (${genre})`,
        subheader: author,
        description: description,
        buttonText: 'Перейти к проекту',
        date: date,
        likes: likes,
        buttonVariant: 'contained'
    }

    const link = <Link style={{
        textDecoration: "none",
        color: "gray",
        fontSize: 20
    }} to={`/profile/${author_id}`}>{tier.subheader}</Link>

    const deleteProject = () => {
        const result = Swal.fire({
            title: 'Вы уверены?',
            text: "Удаленный проект нельзя восстановить!",
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
                    'Ваш проект удален.',
                    'success'
                )
                $authHost.post(`api/news/deleteProject`, {project_id})
                deleteCurrentProject(project_id)
            }
        })
    }

    return (
        <Card className={classes.card}>
            <CardHeader
                title={tier.title}
                subheader={link}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
            />
            <CardContent style={{height: "auto"}}>
                <p>
                    {tier.description}
                </p>
            </CardContent>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <p style={{margin: 0, color: "silver"}}>{tier.date}</p>
                <div onClick={likeIt} className="likes" style={{
                    cursor: 'pointer',
                    display: 'flex',
                    width: 60,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: liked ? 'blue' : 'black'
                }}>
                    <FavoriteIcon />
                    <p style={{
                        margin: 0,
                    }}> {tier.likes}</p>
                </div>
            </div>
            <CardActions>
                {isInProjects && <Button component={Link} to={`/projectEditor/${project_id}`} fullWidth variant="outlined" color="primary">
                    Редактор проекта
                </Button>}
                {isInProjects && <Button onClick={deleteProject} fullWidth variant="contained" color="secondary">
                    Удалить проект
                </Button>}
                {!isInProject && <Button component={Link} to={`/project/${project_id}`} fullWidth variant={tier.buttonVariant} color="primary">
                    {tier.buttonText}
                </Button>}
            </CardActions>
        </Card>
    );
}