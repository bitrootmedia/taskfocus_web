import {defineStore} from "pinia";
import axios from "./../axios.js";
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
        async fetchUsersTasks(payload) {
            let url = `/user-task-queue?`

            if (payload?.id) url += `user=${payload.id}`
            if (payload?.query) url += `&${payload.query}`

            return await axios.get(url)
        },

        async updateOrder(payload) {
            const id = payload.id
            delete payload.id
            return await axios.post(`/user-task-queue-position-change/${id}`, payload)
        },

        async fetchWorkingTask(payload) {
            const resp = await axios.get(`/current-task?user=${payload.id}`)
            if (resp.data) return resp.data
            return null
        },

        async fetchUsersTasksQueue(payload) {
            return await axios.get(`/user-task-queue-manage/${payload.id}`)
        },

        async assignUserToQueue(payload) {
            const id = payload.task
            delete payload.task
            return await axios.post(`/user-task-queue-manage/${id}`,payload)
        },

        async removeUserFromQueue(payload) {
            const id = payload.task
            delete payload.task
            return await axios.delete(`/user-task-queue-manage/${id}`,{ data: payload })
        },
    },
})
