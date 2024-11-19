import { defineStore } from "pinia";
import axios from "./../axios.js";
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
            let url = `/projects?`

            if (payload?.query) url += `&${payload.query}`
            if (payload?.sorting) url += `&ordering=${payload.sorting}`
            if (payload?.search) url += `&title=${payload.search}`
            if (payload?.userId) url += `&user=${payload.userId}`

            if (payload?.isClosed) { url += `&show_closed=False` }
            if (payload?.hideClosed) { url += `&show_closed=False` }

            return await axios.get(url)
        },

        async fetchProjectById(payload) {
            const resp = await axios.get(`/project/${payload.id}`)
            this.project = resp.data
            return resp
        },

        async createProject(payload) {
            return await axios.post(`/projects`, payload)
        },

        async updateProject(payload) {
            const id = payload.id
            delete payload.id
            return await axios.put(`/project/${id}`, payload)
        },

        async updateProjectOwner(payload) {
            const id = payload.id
            delete payload.id
            return await axios.post(`/change-project-owner/${id}`, payload)
        },

        async fetchProjectAccess(payload) {
            const id = payload.id
            return await axios.get(`/project-accesses?project=${id}`)
        },

        async fetchAllProjectAccess(payload) {
            return await axios.get(`/project-accesses`)
        },

        async assignUserToProject(payload) {
            return await axios.post(`/project-accesses`, payload)
        },

        async removeUserFromProject(payload) {
            const id = payload.id
            return await axios.delete(`/project-access/${id}`)
        },

    },
})
