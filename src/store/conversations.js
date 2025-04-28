import {defineStore} from "pinia";
import axios from "./../axios.js";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const token = cookies.get('task_focus_token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Token ${token}`
}
const baseUrl = 'https://stage-api.ayeayecaptain.io'


export const useConversationsStore = defineStore('conversations', {
  state: () => ({}),

  actions: {
    async fetchAllUsers(payload) {
      let url = `/messenger/users`

      if (payload?.search) url += `&search=${payload.search}`

      return await axios({
        method:'get',
        url: url,
        baseURL: baseUrl,
      })
    },

    async fetchAllThreads(payload) {
      let url = `/messenger/threads`

      if (payload?.search) url += `&search=${payload.search}`

      return await axios({
        method:'get',
        url: url,
        baseURL: baseUrl,
      })
    },

    async fetchUserThreads(payload) {
      let url = `/messenger/threads/${payload.id}`

      return await axios({
        method:'get',
        url: url,
        baseURL: baseUrl,
      })
    },

    async fetchConversationByThreadId(payload) {
      let url = `/messenger/conversations/${payload.id}`

      return await axios({
        method:'get',
        url: url,
        baseURL: baseUrl,
      })
    },

    async sendMessage(payload) {
      let url = `/messenger/conversations/${payload.thread}`

      return await axios({
        method:'post',
        url: url,
        baseURL: baseUrl,
        data: payload,
      })
    },

    async sendDirectThreadMessage(payload) {
      let url = `/messenger/direct-threads/{thread_id}/messages/`

      return await axios({
        method:'post',
        url: url,
        baseURL: baseUrl,
        data: payload,
      })
    },

    async sendThreadMessage(payload) {
      let url = `/messenger/threads/{thread_id}/messages/`

      return await axios({
        method:'post',
        url: url,
        baseURL: baseUrl,
        data: payload,
      })
    },

    async createNewDirectThread(payload) {
      let url = `/messenger/direct-threads/`

      return await axios({
        method:'post',
        url: url,
        baseURL: baseUrl,
        data: payload,
      })
    },

    async createNewThread(payload) {
      let url = `/messenger/threads/`

      return await axios({
        method:'post',
        url: url,
        baseURL: baseUrl,
        data: payload,
      })
    },

  },
})
