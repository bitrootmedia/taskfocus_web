import {defineStore} from "pinia";
import axios from "./../axios.js";
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
            return await axios.post(`/boards`, payload)
        },

        async fetchBoards(payload) {
            let url = `/boards?`
            if (payload?.query) url += `&${payload.query}`
            if (payload?.search) url += `&name=${payload.search}`
            return await axios.get(url)
        },

        async fetchBoard(payload) {
            let url = `/board/${payload.id}`
            return await axios.get(url)
        },

        async deleteBoard(payload) {
            return await axios.delete(`/board/${payload.id}`)
        },

        async pinBoard(payload) {
            return await axios.post(`/pin-board/${payload.id}`)
        },

        async unpinBoard(payload) {
            return await axios.delete(`/pin-board/${payload.id}`)
        },

        async fetchPinnedBoards(payload) {
            let url = `/pinned-boards?`
            if (payload?.query) url += `&${payload.query}`
            return await axios.get(url)
        },

        async updateBoard(payload) {
            return await axios.patch(`/board/${payload.id}`, payload)
        },

        //Cards
        async createBoardCard(payload) {
            return await axios.post(`/card-create`, payload)
        },

        async deleteBoardCard(payload) {
            return await axios.delete(`/card-detail/${payload.id}`)
        },

        async updateBoardCard(payload) {
            return await axios.patch(`/card-detail/${payload.id}`, payload)
        },

        async updateBoardCardMove(payload) {
            return await axios.put(`/card-move`, payload)
        },

        //Card Item
        async createBoardCardItem(payload) {
            return await axios.post(`/card-item-create`, payload)
        },

        async updateBoardCardItemMove(payload) {
            return await axios.put(`/card-item-move`, payload)
        },

        async deleteBoardCardItem(payload) {
            return await axios.delete(`/card-item-detail/${payload.id}`)
        },

        async updateBoardCardItem(payload) {
            return await axios.put(`/card-item-detail/${payload.id}`, payload)
        },

        //Board Users
        async fetchBoardUsers(payload) {
            let url = `/board-users/${payload.id}`
            return await axios.get(url)
        },

        async assignBoardUser(payload) {
            return await axios.post(`/board-users/${payload.id}`, payload)
        },

        async removeBoardUser(payload) {
            const id = payload.id
            delete payload.id
            return await axios.delete(`/board-users/${id}`, {data: payload})
        },
    },
})
