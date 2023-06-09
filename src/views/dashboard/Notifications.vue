<template>
  <div class="main-container">
    <div class="content mt-4">

      <div class="header flex items-center gap-x-6 mb-4">
        <h2 class="font-bold text-xl block text-blueGray-700">Notifications</h2>
      </div>


      <Loader v-if="loading" />

      <div v-else-if="!notifications.length">
        <p class="flex text-center px-4 justify-center py-8 text-blueGray-500 text-3xl font-medium">
          No data found
        </p>
      </div>

      <div v-else class="border border-blueGray-200 shadow-lg rounded-[4px] px-4 py-3 mb-4"
           :class="[`${item.status === 'UNREAD' ? 'bg-amber-50' : ''}`]"
           v-for="(item,index) in notifications"
           :key="item.id">
        <div class="flex justify-between mb-2">
          <h4 class="text-lg font-semibold text-blueGray-700">{{ item.notification.tag }}</h4>
          <button
              v-if="item.status === 'UNREAD'"
              @click="markAsRead(item.id)"
              class="bg-yellow-600 text-white active:bg-blueGray-600 text-sm font-bold px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
          >
            Close
          </button>
        </div>

        <div class="text-blueGray-800" :class="{'text-line-3': !readMore[index]}">
          {{ item.notification.content }}
        </div>

        <div v-if="item.notification.content.length > 120 && !readMore[index]">
          <span class="cursor-pointer font-semibold underline mt-1 text-blueGray-700 text-sm"
                @click.stop="readMoreText(index)">Read More</span>
        </div>

        <div class="mt-2 text-blueGray-600">
          <span v-if="item.notification.task" class="block">Task:
          <router-link :to="`/dashboard/task/${item.notification.task.id}`" class="underline text-blue-500">{{
              item.notification.task.title
            }}</router-link>
          </span>

          <span v-if="item.notification.project" class="block">Project:
          <router-link :to="`/dashboard/project/${item.notification.project.id}`" class="underline text-blue-500">{{
              item.notification.project.title
            }}</router-link>
          </span>
        </div>

        <div class="flex justify-end text-blueGray-500 font-semibold text-sm mt-2">
          {{ convertTimeAgo(item.created_at) }}
        </div>
      </div>

      <Pagination
          v-if="paginate.pagination.value.total > 1"
          :pagination="paginate.pagination.value"
          v-model:query="paginate.query.value"
      />

    </div>
  </div>
</template>

<script setup>
import Loader from "./../../components/Loader/Loader.vue"
import {ref} from "vue";
import {catchErrors} from "../../utils";
import config from "../../config";
import {convertTimeAgo} from "../../utils";
import {usePaginate} from "../../composables/usePaginate";
import {useNotifications} from "../../store/notifications";
import Pagination from './../../components/Pagination/Pagination.vue'


const notificationsStore = useNotifications()

//State
const loading = ref(true)
const readMore = ref([])
const notifications = ref([])


//Methods
const readMoreText = (index) => {
  readMore.value[index] = true
}

const markAsRead = async (id) => {
  try {
    loading.value = true
    await notificationsStore.markAsRead({id})
    await fetchNotifications(true)
  } catch (e) {
    catchErrors(e)
  }
}

const fetchNotifications = async (isNeedUpdate = null) => {
  try {
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      isNeedUpdate,
    }

    const resp = await notificationsStore.fetchNotifications(options)
    notifications.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}

// Composables
const options = {
  pageSize: config.NOTIFICATIONS_PAGE_SIZE
}
const paginate = usePaginate(fetchNotifications, options)

fetchNotifications()

</script>

