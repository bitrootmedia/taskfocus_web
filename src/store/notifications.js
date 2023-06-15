import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useNotifications = defineStore('notifications', {
    state: () => ({
        count: 0
    }),

    getters: {
        notificationsCount: (state) => state.count,
    },

    actions: {
        async fetchNotifications(payload) {
            let url = `${config.BASE_API_URL}/notifications?`

            if (payload?.status) url += `&status=${payload.status}`
            if (payload?.query) url += `&${payload.query}`

            const resp = await axios.get(url)

            if (payload.isNeedUpdate && this.count !== 0) this.count = this.count - 1
            if (payload.status ) this.count = resp.data.count

            return resp
        },

        async markAsRead(payload) {
            return await axios.post(`${config.BASE_API_URL}/notification-confirm/${payload.id}`)
        },
    },
})