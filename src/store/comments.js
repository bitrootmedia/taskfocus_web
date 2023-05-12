import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useCommentsStore = defineStore('comments', {
    state: () => ({
        comments: {}
    }),

    actions: {
        async fetchComments(payload) {
            let url = `${config.BASE_API_URL}/comments?`

            if (payload?.id && payload.type === 'project') url += `project=${payload.id}`
            if (payload?.id && payload.type === 'task') url += `task=${payload.id}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&search=${payload.search}`

            return await axios.get(url)
        },

        async createComments(payload) {
            return await axios.post(`${config.BASE_API_URL}/comments`,payload)
        },

        async updateComment(payload) {
            const id = payload.id
            delete payload.id
            return await axios.patch(`${config.BASE_API_URL}/comment/${id}`,payload)
        },
    },
})