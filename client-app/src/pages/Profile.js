import React, {useContext} from 'react'
import '../css/profile.css'
import Button from "@material-ui/core/Button";
import PersonalDataEditor from "../components/ProfilePage/PersonalDataEditor";
import DataTable from "../components/ProfilePage/DataTable";
import Subscribes from "../components/ProfilePage/Subscribes";
import {Context} from "../index";
import Subscribers from "../components/ProfilePage/Subscribers";

const click = () => {
    localStorage.setItem('token', null);
    window.location.reload();
}

const Profile = () => {
    const {user} = useContext(Context)

    return (
        <div className="profile_cart">
            <DataTable user={user} />
            <PersonalDataEditor />
            <Subscribes />
            <Subscribers />
            <Button onClick={() => click()} variant="contained" color="secondary" style={{
                display: "block",
                margin: "17px auto"
            }}>
                Выйти
            </Button>
            <br style={{marginTop: 20}}/>
        </div>
    );
};

export default Profile;