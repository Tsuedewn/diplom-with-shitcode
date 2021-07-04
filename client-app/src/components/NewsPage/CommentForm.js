import React, {useContext} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {$authHost, $host} from "../../http";
import {Context} from "../../index";

const CommentForm = ({project_id, user_id, addComment, user_login}) => {
    const [messageValue, setMessageValue] = React.useState('');

    const submitHandler = async () => {
        const response = await $authHost.post('api/news/setComment', {
            project_id,
            text: messageValue,
            user_id
        })
        setMessageValue('')
        let comment = response.data
        comment.user = {}
        comment.user.login = user_login
        comment.user.id = comment.user_id
        console.log(comment)
        addComment(comment)
    }

    return (
        <form style={{width: 600, margin: "0 auto 30px auto"}}>
            <TextField
                label="Написать сообщение"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                multiline
                rows={4}
                variant="outlined"
                style={{display: "flex", margin: "15px 0 15px 0"}}
            />
            <Button
                variant="contained"
                color="secondary"
                style={{display: 'block', margin: '0 auto'}}
                onClick={submitHandler}
            >
                Отправить сообщение
            </Button>
        </form>
    );
};

export default CommentForm;