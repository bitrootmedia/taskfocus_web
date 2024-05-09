import { defineStore } from "pinia";
import axios from "axios";
import config from "../config"
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useProjectStore = defineStore('project', {
    state: () => ({
        project: {},
    }),

    getters: {
        currentProject: (state) => state.project,
    },

    actions: {
        async fetchProjects(payload) {
            let url = `${config.BASE_API_URL}/projects?`

            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&title=${payload.search}`
            if (payload?.userId) url += `&user=${payload.userId}`

            if (payload?.isClosed) { url += `&show_closed=False` }
            if (payload?.hideClosed) { url += `&show_closed=False` }

            return await axios.get(url)
        },

        async fetchProjectById(payload) {
            const resp = await axios.get(`${config.BASE_API_URL}/project/${payload.id}`)
            this.project = resp.data
            return resp
        },

        async createProject(payload) {
            return await axios.post(`${config.BASE_API_URL}/projects`, payload)
        },

        async updateProject(payload) {
            const id = payload.id
            delete payload.id
            return await axios.put(`${config.BASE_API_URL}/project/${id}`, payload)
        },

        async updateProjectOwner(payload) {
            const id = payload.id
            delete payload.id
            return await axios.post(`${config.BASE_API_URL}/change-project-owner/${id}`, payload)
        },

        async fetchProjectAccess(payload) {
            const id = payload.id
            return await axios.get(`${config.BASE_API_URL}/project-accesses?project=${id}`)
        },

        async fetchAllProjectAccess(payload) {
            return await axios.get(`${config.BASE_API_URL}/project-accesses`)
        },

        async assignUserToProject(payload) {
            return await axios.post(`${config.BASE_API_URL}/project-accesses`, payload)
        },

        async removeUserFromProject(payload) {
            const id = payload.id
            return await axios.delete(`${config.BASE_API_URL}/project-access/${id}`)
        },

    },
})