import React, {useContext, useEffect, useState} from 'react';
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import {$host} from "../../http";
import {Context} from "../../index";

const CommentList = ({project_id}) => {
    const [comments, setComments] = useState([])
    const {user} = useContext(Context)

    useEffect(async () => {
        const response = await $host.get(`api/news/getComments?id=${project_id}`)
        setComments(response.data)
    }, [])

    const addComment = (comment) => {
        let newComments = [...comments]
        newComments.push(comment)
        setComments(newComments)
    }

    return (
        <div>
            {!!comments.length &&
                comments.map(comment => {
                    comment.updatedAt = comment.updatedAt?.slice(0, 10).replace('-', '.').replace('-', '.')
                    return <Comment
                        date={comment.updatedAt}
                        user_id={comment.user.id}
                        text={comment.text}
                        user_login={comment.user.login}
                    />
                })
            }
            {user.isAuth && <CommentForm
                project_id={project_id}
                user_id={user.user.id}
                addComment={addComment}
                user_login={user.user.login}
            />}
        </div>
    );
};

export default CommentList;