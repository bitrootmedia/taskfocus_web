import {defineStore} from "pinia";
import axios from "./../axios.js";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useLogsStore = defineStore('logs', {
    state: () => ({
        logs: {}
    }),

    actions: {
        async fetchLogs(payload) {
            let url = `/logs?`

            if (payload?.id && payload.type === 'project') url += `project=${payload.id}`
            if (payload?.id && payload.type === 'task') url += `task=${payload.id}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&search=${payload.search}`

            return await axios.get(url)
        },
    },
})
