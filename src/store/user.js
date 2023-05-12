import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {}
    }),

    getters: {
        currentUser: (state) => state.user,
    },

    actions: {
        async login(payload) {
            return await axios.post(`${config.BASE_API_URL}/auth/login/`, payload)
        },
        async logout(payload) {
            return await axios.post(`${config.BASE_API_URL}/auth/logout/`)
        },
        async fetchUser(payload) {
            const headers = {
                Authorization: `Token ${payload}`
            }
            return await axios.get(`${config.BASE_API_URL}/auth/user/`,{headers})
        },

        async fetchUsers(payload) {
            return await axios.get(`${config.BASE_API_URL}/users`)
        },
    },
})