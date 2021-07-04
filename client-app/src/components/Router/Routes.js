import Profile from "../../pages/Profile";
import Messages from "../../pages/Messages";
import Auth from "../../pages/Auth";
import News from "../../pages/News";
import Projects from "../../pages/Projects";
import SomeProfile from "../../pages/SomeProfile";
import SomeProject from "../../pages/SomeProject";
import ProjectEditor from "../../pages/ProjectEditor";

export const authRoutes = [
    {
        path: '/projectEditor/:id',
        Component: ProjectEditor
    },

    {
        path: '/messages',
        Component: Messages
    },

    {
        path: '/profile',
        Component: Profile
    },

    {
        path: '/projects',
        Component: Projects
    }
]

export const publicRoutes = [
    {
        path: '/auth',
        Component: Auth
    },

    {
        path: '/news',
        Component: News
    },

    {
        path: '/profile/:id',
        Component: SomeProfile
    },

    {
        path: '/project/:id',
        Component: SomeProject
    },
]