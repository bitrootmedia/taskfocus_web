import {defineStore} from "pinia";
import axios from "./../axios.js";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        task: {},
        tempProject: {},
        expiredRemindersCount: false
    }),

    getters: {
        currentTask: (state) => state.task,
    },

    actions: {
        async fetchTasksTracker(payload) {
            let url = `/task-sessions?`

            if (payload?.id) url += `task=${payload.id}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&title=${payload.search}`
            if (payload?.user) url += `&user=${payload.user}`

            return await axios.get(url)
        },

        async updateTimeTracker(payload) {
            const id = payload.id
            delete payload.id
            return await axios.patch(`/task-session/${id}`,payload)
        },

        async fetchTasks(payload) {
            let url = `/tasks?`

            if (payload?.is_urgent) url += `is_urgent=true`
            if (payload?.id) url += `&project=${payload.id}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&query=${payload.search}`
            if (payload?.tag) url += `&tag=${payload.tag}`
            if (payload?.urgency_level) url += `&urgency_level=${payload.urgency_level}`
            if (payload?.projectSearch) url += `&project__title=${payload.projectSearch}`
            if (payload?.isClosed) url += `&is_closed=false`
            if (payload?.responsible) url += `&responsible=${payload.responsible.pk}`
            if (payload?.responsibleUser) url += `&responsible=${payload.responsibleUser}`
            if (payload?.userId) url += `&user=${payload.userId}`
            if (payload?.owner) url += `&owner=${payload.owner}`
            if (payload?.createdAtAfter) url += `&created_at_after=${payload.createdAtAfter}`
            if (payload?.createdAtBefore) url += `&created_at_before=${payload.createdAtBefore}`
            if (payload.status && payload.status !== 'NONE') url += `&status=${payload.status}`

            return await axios.get(url)
        },

        async updateOrder(payload) {
            const id = payload.id
            delete payload.id

            return await axios.post(`/task-position-change/${id}`,payload)
        },

        async createTask(payload) {
            return await axios.post(`/tasks`,payload)
        },

        async fetchTaskById(payload){
            const resp = await axios.get(`/task/${payload.id}`)
            this.task = resp.data
            return resp
        },

        async fetchTaskBlocks(payload){
            return await axios.get(`/task-block-list/${payload.id}`)
        },

        async createTaskBlocks(payload){
            return await axios.post(`/task-block-list/${payload.id}`,payload.block)
        },

        async updateTaskBlocks(payload){
            return await axios.put(`/task-block/${payload.id}`,payload)
        },

        async deleteTaskBlocks(payload){
            return await axios.delete(`/task-block/${payload}`)
        },

        async fetchTaskTime(payload){
            return await axios.get(`/task-total-time/${payload.id}`)
        },

        async updateTaskOwner(payload) {
            const id = payload.id
            delete payload.id
            return await axios.post(`/change-task-owner/${id}`,payload)
        },

        async updateTask(payload) {
            const id = payload.id
            delete payload.id
            return await axios.patch(`/task/${id}`,payload)
        },

        async pinTask(payload) {
            const id = payload.id
            return await axios.post(`/pin-task/${id}`)
        },

        async unPinTask(payload) {
            const id = payload.id
            return await axios.delete(`/pin-task/${id}`)
        },

        async fetchPinnedTasks(payload) {
            let url = `/pinned-tasks?`

            if (payload?.query) url += `&${payload.query}`

            return await axios.get(url)
        },

        async startTask(payload) {
            return await axios.post(`/task-start-work/${payload.id}`)
        },

        async stopTask(payload) {
            return await axios.post(`/task-stop-work/${payload.id}`)
        },

        async closeTask(payload) {
            const id = payload.id
            delete payload.id
            return await axios.post(`/task-close/${id}`,payload)
        },

        async unCloseTask(payload) {
            return await axios.post(`/task-unclose/${payload.id}`)
        },

        async fetchDictionary(payload){
            return await axios.get(`/dictionary`)
        },

        async fetchWorkingTask(payload){
            let url = `/current-task`

            if (payload?.id) url += `?user=${payload.id}`

            return await axios.get(url)
        },

        async fetchEvents(payload){
            let url = `/work_session_breakdown`
            return await axios.post(url, payload)
        },

        async fetchTaskAccess(payload) {
            const id = payload.id
            return await axios.get(`/task-accesses?task=${id}`)
        },

        async assignUserToTask(payload) {
            return await axios.post(`/task-accesses`,payload)
        },

        async removeUserFromTask(payload) {
            const id = payload.id
            return await axios.delete(`/task-access/${id}`)
        },

        async fetchReminders(payload) {
            let url = `/reminders?open_only=true`

            if (payload?.id) url += `&task=${payload.id}`
            if (payload?.query) url += `&${payload.query}`

            return await axios.get(url)
        },

        async createReminders(payload) {
            return await axios.post(`/reminders`,payload)
        },

        async closeReminder(payload) {
            return await axios.post(`/reminder-close/${payload.id}`)
        },
    },
})
