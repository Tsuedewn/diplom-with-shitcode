import React, {useContext, useEffect, useRef} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Context, FireContext} from "../../index";
import {useCollectionData} from "react-firebase-hooks/firestore";
import firebase from 'firebase'
import Swal from "sweetalert2";

function Chat() {
    const {user} = useContext(Context)
    const {firestore} = useContext(FireContext)
    const [messageValue, setMessageValue] = React.useState('');
    const messagesRef = useRef(null);

    const [messages, loading] = useCollectionData(
        firestore.collection('messages').orderBy('createdAt')
    )

    useEffect(() => {
        messagesRef && messagesRef.current?.scrollTo(0, 99999)
    }, [messages])

    if (loading) {
        return 'Загрузка'
    }

    const sendMessage = async () => {
        if (messageValue === '') {
            Swal.fire('Вы ввели пустое сообщение!')
        } else {
            firestore.collection('messages').add({
                id: user.user.id,
                login: user.user.login,
                text: messageValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            setMessageValue('')
        }
    }

    return (
      <div className="chat">
        <div className="chat-messages">
          <div ref={messagesRef} className="messages">
              {messages.map(message => {
                  return <div className="message">
                      <p>{message.text}</p>
                      <div>
                          <span>{message.login}</span>
                      </div>
                  </div>
              })}
          </div>
          <form>
              <TextField
                  label="Написать сообщение"
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  style={{display: "flex", margin: "15px 0 15px 0"}}
              />
              <Button variant="contained" color="secondary" onClick={sendMessage}>
                  Отправить сообщение
              </Button>
          </form>
        </div>
      </div>
    );
}

export default Chat;
