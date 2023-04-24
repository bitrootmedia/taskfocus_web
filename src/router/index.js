import {createRouter, createWebHistory} from "vue-router";
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies()

// layouts
import Auth from "../layouts/Auth.vue";
import Admin from "../layouts/Admin.vue";

// views for Auth layout
import Login from "../views/auth/Login.vue";
import Dashboard from "../views/dashboard/Dashboard.vue";
import ProjectList from "../views/dashboard/ProjectList.vue";
import CreateProject from "../views/dashboard/CreateProject.vue";
import CreateTask from "../views/dashboard/CreateTask.vue";
import ProjectDetail from "../views/dashboard/ProjectDetail.vue";
import TaskDetail from "../views/dashboard/TaskDetail.vue";
import UserGuide from "../views/dashboard/UserGuide.vue";

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
        ],
        beforeEnter: (to, from,next) => {
            const token = cookies.get('crowdsteer_token')
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
                path: "/dashboard/user-guide",
                component: UserGuide,
                name: 'User Guide',
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
    const token = cookies.get('crowdsteer_token')

    if (to.name !== 'Login' && !token) next({ name: 'Login' })
    else next()
})