import {defineStore} from "pinia";
import axios from "axios";
import config from "../config"
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const useBoardsStore = defineStore('boards', {
    state: () => ({
        logs: {}
    }),

    actions: {
        //Boards
        async createBoard(payload) {
            return await axios.post(`${config.BASE_API_URL}/boards`, payload)
        },

        async fetchBoards(payload) {
            let url = `${config.BASE_API_URL}/boards?`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.search) url += `&name=${payload.search}`
            return await axios.get(url)
        },

        async fetchBoard(payload) {
            let url = `${config.BASE_API_URL}/board/${payload.id}`
            return await axios.get(url)
        },

        async deleteBoard(payload) {
            return await axios.delete(`${config.BASE_API_URL}/board/${payload.id}`)
        },

        async updateBoard(payload) {
            return await axios.patch(`${config.BASE_API_URL}/board/${payload.id}`, payload)
        },

        //Cards
        async createBoardCard(payload) {
            return await axios.post(`${config.BASE_API_URL}/card-create`, payload)
        },

        async deleteBoardCard(payload) {
            return await axios.delete(`${config.BASE_API_URL}/card-detail/${payload.id}`)
        },

        async updateBoardCard(payload) {
            return await axios.patch(`${config.BASE_API_URL}/card-detail/${payload.id}`, payload)
        },

        async updateBoardCardMove(payload) {
            return await axios.put(`${config.BASE_API_URL}/card-move`, payload)
        },

        //Card Item
        async createBoardCardItem(payload) {
            return await axios.post(`${config.BASE_API_URL}/card-item-create`, payload)
        },

        async updateBoardCardItemMove(payload) {
            return await axios.put(`${config.BASE_API_URL}/card-item-move`, payload)
        },

        async deleteBoardCardItem(payload) {
            return await axios.delete(`${config.BASE_API_URL}/card-item-detail/${payload.id}`)
        },

        async updateBoardCardItem(payload) {
            return await axios.put(`${config.BASE_API_URL}/card-item-detail/${payload.id}`, payload)
        },

        //Board Users
        async fetchBoardUsers(payload) {
            let url = `${config.BASE_API_URL}/board-users/${payload.id}`
            return await axios.get(url)
        },

        async assignBoardUser(payload) {
            return await axios.post(`${config.BASE_API_URL}/board-users/${payload.id}`, payload)
        },

        async removeBoardUser(payload) {
            const id = payload.id
            delete payload.id
            return await axios.delete(`${config.BASE_API_URL}/board-users/${id}`, { data: payload })
        },
    },
})
