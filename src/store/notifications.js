import {defineStore} from "pinia";
import axios from "./../axios.js";
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
            let url = `/notifications?`

            if (payload?.status) url += `&status=${payload.status}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.id) url += `&id=${payload.id}`

            const resp = await axios.get(url)

            if (!payload?.id){
                if (payload.isNeedUpdate && this.count !== 0) this.count = this.count - 1
                if (payload.status ) this.count = resp.data.count
            }

            return resp
        },

        async markAsRead(payload) {
            return await axios.post(`/notification-confirm/${payload.id}`)
        },
    },
})
