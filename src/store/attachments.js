import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('crowdsteer_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useAttachmentsStore = defineStore('attachments', {
    state: () => ({
        attachments: {}
    }),

    actions: {
        async fetchAttachments(payload) {
            let url = `${config.BASE_API_URL}/attachments?`

            if (payload?.id && payload.type === 'project') url += `project=${payload.id}`
            if (payload?.id && payload.type === 'task') url += `task=${payload.id}`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`

            return await axios.get(url)
        },

        async uploadAttachments(payload) {
            return await axios.post(`${config.BASE_API_URL}/upload`,payload,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        },
    },
})