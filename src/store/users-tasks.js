import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useUsersTasksStore = defineStore('users-tasks', {
    state: () => ({
        tempProject: {}
    }),

    actions: {
        async fetchUsersTask(payload) {
            return await axios.get(`${config.BASE_API_URL}/user-task-queue?user=${payload.id}`)
        },

        async updateOrder(payload) {
            const id = payload.id
            delete payload.id
            return await axios.post(`${config.BASE_API_URL}/user-task-queue-position-change/${id}`, payload)
        },

        async fetchWorkingTask(payload) {
            const resp = await axios.get(`${config.BASE_API_URL}/current-task?user=${payload.id}`)
            if (resp.data) return resp.data

            return null
        },
    },
})