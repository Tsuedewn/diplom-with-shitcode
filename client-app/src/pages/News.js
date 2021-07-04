import React, {useContext, useEffect, useState} from 'react';
import Project from "../components/NewsPage/Project";
import {$host} from "../http";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {makeStyles, TextField} from "@material-ui/core";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import {Context} from "../index";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles({
    root: {
        width: 500,
        margin: '0 auto'
    },
});

function RestoreIcon() {
    return null;
}

function LocationOnIcon() {
    return null;
}

const News = () => {
    const {user} = useContext(Context)
    const [projects, setProjects] = useState([])
    const classes = useStyles()
    const [value, setValue] = React.useState('')
    const [type, setType] = React.useState('')
    const [search, setSearch] = React.useState('')

    useEffect(() => {
        (async () => {
            let response = await $host.get(`api/news/getProjects?filter=${type}&id=${user.user.id}`)
            response = response.data.map((item) => {
                item.updatedAt = item.updatedAt.slice(0, 10).replace('-', '.').replace('-', '.')
                return item
            })
            setProjects(response)
        })()
    }, [type])

    return (
        <>
            {user.isAuth && <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label="Последние" onClick={() => {setType('last')}} icon={<ArtTrackIcon />} />
                <BottomNavigationAction label="Из подписок" onClick={() => setType('sub')} icon={<BookmarkBorderIcon />} />
            </BottomNavigation>}
            {user.isAuth && <div style={{
                width: 200,
                margin: '0 auto',
                display: "flex",
                alignItems: 'center'
            }}>
                <TextField
                    style={{
                        display: 'block'
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                <SearchIcon
                    onClick={() => {
                        setType(`search:${search}`)
                        setSearch('')
                    }}
                />
            </div>}

            {projects.map(project =>
                <Project
                    key={project.id}
                    name={project.name}
                    genre={project.genre}
                    author={project.user.login}
                    description={project.description}
                    date={project.updatedAt}
                    author_id={project.user_id}
                    project_id={project.id}
                />
            )}
        </>
    );
};

export default News;