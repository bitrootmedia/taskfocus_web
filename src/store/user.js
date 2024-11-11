import {defineStore} from "pinia";
import axios from "./../axios.js";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useUserStore = defineStore('user', {
    state: () => ({
        panel: {
            show: false,
            callback: null,
        }
    }),

    getters: {
        currentUser: (state) => state.user,
        showPanel: (state) => state.panel,
    },

    actions: {
        setShowPanel(payload) {
            this.panel = payload
        },
        async login(payload) {
            return await axios.post(`/auth/login/`, payload)
        },
        async logout() {
            return await axios.post(`/auth/logout/`)
        },
        async fetchUser(payload) {
            const headers = {
                Authorization: `Token ${payload}`
            }
            return await axios.get(`/auth/user/`, {headers})
        },

        async fetchUsers(payload) {
            let url = `/users?`
            if (payload) url += `&search=${payload}`

            return await axios.get(url)
        },

        async fetchCurrentUser(payload) {
            return await axios.get(`/user/${payload.id}`)
        },

        async fetchUsersPage(payload) {
            let url = `/users?`

            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`

            return await axios.get(url)
        },

        async resetPassword(payload) {
            return await axios.post(`/auth/password/reset/`, payload)
        },

        async updatePassword(payload) {
            return await axios.post(`/auth/password/change/`, payload)
        },

        async confirmPassword(payload) {
            return await axios.post(`/auth/password/reset/confirm/`, payload)
        },
    },
})
