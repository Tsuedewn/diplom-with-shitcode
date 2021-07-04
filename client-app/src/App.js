import "./css/App.css"
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/Router/AppRouter";
import SimpleBottomNavigation from "./components/BottomNavigation";
import React, {useContext, useEffect} from "react";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {observer} from "mobx-react-lite";

const App = observer(() => {
  const {user} = useContext(Context)

  useEffect(() => {
      check().then(data => {
          user.setUser({
              id: data.id,
              login: data.login,
              email: data.email
          })
          user.setIsAuth(true)
      })
  })

  return (
    <BrowserRouter>
      <SimpleBottomNavigation/>
      <AppRouter/>
    </BrowserRouter>
  );
})

export default App;
