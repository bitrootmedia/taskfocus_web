import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useNotesStore = defineStore('notes', {
    state: () => ({
        notes: {}
    }),

    actions: {
        async fetchNotes(payload) {
            let url = `${config.BASE_API_URL}/private-notes?`

            if (payload?.id) url += `task=${payload.id}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&search=${payload.search}`

            return await axios.get(url)
        },

        async createNote(payload) {
            return await axios.post(`${config.BASE_API_URL}/private-notes?task=${payload.task}`, payload)
        },

        async updateNote(payload) {
            const id = payload.id
            delete payload.id
            return await axios.put(`${config.BASE_API_URL}/private-note/${id}`, payload)
        },

        async deleteNote(payload) {
            const id = payload.id
            delete payload.id
            return await axios.delete(`${config.BASE_API_URL}/private-note/${id}`)
        },

        async fetchAuthNotes(payload) {
            let url = `${config.BASE_API_URL}/notes?`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.search) url += `&title=${payload.search}`
            if (payload?.isClosed) url += `&is_closed=false`

            return await axios.get(url)
        },

        async createAuthNote(payload) {
            return await axios.post(`${config.BASE_API_URL}/notes`, payload)
        },

        async deleteAuthNote(payload) {
            const id = payload.id
            delete payload.id
            return await axios.delete(`${config.BASE_API_URL}/note/${id}`)
        },

        async updateAuthNote(payload) {
            const id = payload.id
            delete payload.id
            return await axios.put(`${config.BASE_API_URL}/note/${id}`, payload)
        },

    },
})
