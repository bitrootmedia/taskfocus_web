import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('crowdsteer_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        tempProject: {}
    }),

    // getters: {
    //     currentUser: (state) => state.user,
    // },

    actions: {
        async fetchTasks(payload) {
            let url = `${config.BASE_API_URL}/tasks?`

            if (payload?.id) url += `project=${payload.id}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&title=${payload.search}`
            if (payload?.isClosed) url += `&is_closed=false`

            return await axios.get(url)
        },

        async updateOrder(payload) {
            const id = payload.id
            delete payload.id

            return await axios.post(`${config.BASE_API_URL}/task-position-change/${id}`,payload)
        },

        async createTask(payload) {
            return await axios.post(`${config.BASE_API_URL}/tasks`,payload)
        },

        async fetchTaskById(payload){
            return await axios.get(`${config.BASE_API_URL}/task/${payload.id}`)
        },

        async updateTask(payload) {
            const id = payload.id
            delete payload.id
            return await axios.patch(`${config.BASE_API_URL}/task/${id}`,payload)
        },

        async startTask(payload) {
            return await axios.post(`${config.BASE_API_URL}/task-start-work/${payload.id}`)
        },

        async stopTask(payload) {
            return await axios.post(`${config.BASE_API_URL}/task-stop-work/${payload.id}`)
        },

        async closeTask(payload) {
            const id = payload.id
            delete payload.id
            return await axios.post(`${config.BASE_API_URL}/task-close/${id}`,payload)
        },

        async unCloseTask(payload) {
            return await axios.post(`${config.BASE_API_URL}/task-unclose/${payload.id}`)
        },

        async fetchDictionary(payload){
            return await axios.get(`${config.BASE_API_URL}/dictionary`)
        },

        async fetchWorkingTask(payload){
            return await axios.get(`${config.BASE_API_URL}/current-task`)
        },

        async fetchTaskAccess(payload) {
            const id = payload.id
            return await axios.get(`${config.BASE_API_URL}/task-accesses?task=${id}`)
        },

        async assignUserToTask(payload) {
            return await axios.post(`${config.BASE_API_URL}/task-accesses`,payload)
        },

        async removeUserFromTask(payload) {
            const id = payload.id
            return await axios.delete(`${config.BASE_API_URL}/task-access/${id}`)
        },
    },
})