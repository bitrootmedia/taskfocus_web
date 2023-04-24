import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('crowdsteer_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useProjectStore = defineStore('project', {
    state: () => ({

    }),

    // getters: {
    //     currentUser: (state) => state.user,
    // },

    actions: {
        async fetchProjects(payload) {
            let url = `${config.BASE_API_URL}/projects?${payload.query}`

            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&title=${payload.search}`

            return await axios.get(url)
        },

        async fetchProjectById(payload) {
            return await axios.get(`${config.BASE_API_URL}/project/${payload.id}`)
        },

        async createProject(payload) {
            return await axios.post(`${config.BASE_API_URL}/projects`,payload)
        },

        async updateProject(payload) {
            const id = payload.id
            delete payload.id
            return await axios.put(`${config.BASE_API_URL}/project/${id}`,payload)
        },

        async fetchProjectAccess(payload) {
            const id = payload.id
            return await axios.get(`${config.BASE_API_URL}/project-accesses?project=${id}`)
        },

        async fetchAllProjectAccess(payload) {
            return await axios.get(`${config.BASE_API_URL}/project-accesses`)
        },

        async assignUserToProject(payload) {
            return await axios.post(`${config.BASE_API_URL}/project-accesses`,payload)
        },

        async removeUserFromProject(payload) {
            const id = payload.id
            return await axios.delete(`${config.BASE_API_URL}/project-access/${id}`)
        },

    },
})