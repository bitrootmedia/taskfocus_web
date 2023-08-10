import {createRouter, createWebHistory} from "vue-router";
import config from "../config"
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies()

// layouts
import Auth from "../layouts/Auth.vue";
import Admin from "../layouts/Admin.vue";

// views for Auth layout
import Login from "../views/auth/Login.vue";
import ResetPassword from "../views/auth/ResetPassword.vue";
import Dashboard from "../views/dashboard/Dashboard.vue";
import ProjectList from "../views/dashboard/ProjectList.vue";
import CreateProject from "../views/dashboard/CreateProject.vue";
import CreateTask from "../views/dashboard/CreateTask.vue";
import ProjectDetail from "../views/dashboard/ProjectDetail.vue";
import TaskDetail from "../views/dashboard/TaskDetail.vue";
import UsersTasks from "../views/dashboard/UsersTasks.vue";
import UsersTasksDetail from "../views/dashboard/UsersTasksDetail.vue";
import Tasks from "../views/dashboard/Tasks.vue";
import Comments from "../views/dashboard/Comments.vue";
import Logs from "../views/dashboard/Logs.vue";
import Attachments from "../views/dashboard/Attachments.vue";
import Settings from "../views/dashboard/Settings.vue";
import Reminders from "../views/dashboard/Reminders.vue";
import {useUserStore} from "../store/user";
import Notifications from "../views/dashboard/Notifications.vue";
import TasksTracking from "../views/dashboard/TasksTracking.vue";
import axios from "axios";

// routes
const routes = [
    {
        path: "/",
        component: Auth,
        children: [
            {
                path: "/",
                component: Login,
                name: 'Login'
            },
            {
                path: "/reset-password",
                component: ResetPassword,
                name: 'Reset Password'
            },
        ],
        beforeEnter: (to, from,next) => {
            const token = cookies.get('task_focus_token')
            if (token) next({ name: 'Dashboard' })
            else next()
        },
    },
    {
        path: "/dashboard",
        component: Admin,
        name: 'Admin',
        children: [
            {
                path: "/dashboard",
                component: Dashboard,
                name: 'Dashboard',
            },
            {
                path: "/dashboard/projects",
                component: ProjectList,
                name: 'Project List',
            },
            {
                path: "/dashboard/tasks",
                component: Tasks,
                name: 'Tasks',
            },
            {
                path: "/dashboard/reminders",
                component: Reminders,
                name: 'Reminders',
            },
            {
                path: "/dashboard/comments",
                component: Comments,
                name: 'Comments',
            },
            {
                path: "/dashboard/logs",
                component: Logs,
                name: 'Logs',
            },
            {
                path: "/dashboard/attachments",
                component: Attachments,
                name: 'Attachments',
            },
            {
                path: "/dashboard/create-project",
                component: CreateProject,
                name: 'Create Project',
            },
            {
                path: "/dashboard/create-task",
                component: CreateTask,
                name: 'Create Task',
            },
            {
                path: "/dashboard/project/:id",
                component: ProjectDetail,
                name: 'Project Detail',
            },
            {
                path: "/dashboard/task/:id",
                component: TaskDetail,
                name: 'Task Detail',
            },
            {
                path: "/dashboard/tasks-tracking",
                component: TasksTracking,
                name: 'Time Tracker',
            },
            {
                path: "/dashboard/users",
                component: UsersTasks,
                name: 'Users',
            },
            {
                path: "/dashboard/users-tasks/:id",
                component: UsersTasksDetail,
                name: 'Users Tasks Detail',
            },
            {
                path: "/dashboard/user-settings",
                component: Settings,
                name: 'Settings',
            },
            {
                path: "/dashboard/notifications",
                component: Notifications,
                name: 'Notifications',
            },
        ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from,next) => {
    const token = cookies.get('task_focus_token')
    const userStore = useUserStore()
    document.title = config.PROJECT_NAME || 'Task Focus';

    if (userStore.showPanel.show && from.name === 'Task Detail'){
        const obj = {
            show: false,
            close: null,
            update: null,
        }
        userStore.setShowPanel(obj)
    }

    if (to.name === 'Reset Password') return next()

    if (to.name !== 'Login' && !token) {
        cookies.remove('task_focus_token')
        cookies.remove('task_focus_user')
        delete axios.defaults.headers.common['Authorization'];
        next({ name: 'Login' })
    }
    else {
        next()
    }
})