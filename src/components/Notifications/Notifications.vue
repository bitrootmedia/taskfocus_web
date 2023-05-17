<template>
  <div ref="componentRef">
    <div class="text-white relative mr-6 cursor-pointer" @click="show = !show">
      <i class="fas fa-bell text-lg" :class="[mode === 'dark'? 'text-blueGray-700': 'text-blueGray-300']"></i>
      <span
          v-if="notificationsStore.notificationsCount"
          class="absolute text-sm rounded-full w-4 h-4 text-white flex items-center justify-center bg-red-500 top-0 -right-3">{{
          notificationsStore.notificationsCount
        }}</span>
    </div>

    <div
        class="notifications-wrapper absolute ml-4 sm:ml-0 right-4 sm:right-6 top-[65px] sm:top-[50px] w-auto sm:w-[460px] max-h-[520px] border border-blueGray-200 overflow-y-scroll bg-blueGray-100 px-6 py-6 rounded-[4px] shadow-lg"
        v-if="show">

      <h2 class="text-blueGray-600 text-2xl font-semibold mb-5">Notifications</h2>

      <div v-if="notifications.length && notificationsStore.notificationsCount"
           class="border border-blueGray-200 shadow-lg rounded-[4px] px-4 py-3 mb-3 bg-amber-50"
           v-for="(item,index) in notifications"
           :key="item.id">
        <div class="flex justify-between mb-2">
          <h4 class="text-lg font-semibold text-blueGray-700">{{ item.notification.tag }}</h4>
          <button
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

      <div class="flex items-center justify-center flex-col min-h-[200px]" v-else>
        <h4 class="text-blueGray-600 font-semibold text-lg mt-2">No unread notifications</h4>
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
import {ref, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import {catchErrors} from "../../utils";
import {useNotifications} from "../../store/notifications";
import {convertTimeAgo} from "../../utils";
import {usePaginate} from "../../composables/usePaginate";
import Pagination from './../Pagination/Pagination.vue'
import config from "../../config"


const props = defineProps({
  mode: {
    type: String,
    default: ''
  }
})

const notificationsStore = useNotifications()

//State
const componentRef = ref()
const show = ref(false)
const readMore = ref([])
const notifications = ref([])
let timer = null

onMounted(() => {
  window.addEventListener('click', handleClick)

  setTimeout(() => {
    readMore.value = new Array(notifications.value.length).fill(false)
  }, 500)

  timer = setInterval(() => {
    fetchNotifications()
  }, 10000)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})

onUnmounted(() => {
  clearInterval(timer)
  timer = null
});

//Methods
const handleClick = (e) => {
  if (!componentRef.value.contains(e.target)) {
    show.value = false
  }
}

const fetchNotifications = async () => {
  try {
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
    }

    const resp = await notificationsStore.fetchNotifications(options)
    notifications.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  }
}

const readMoreText = (index) => {
  readMore.value[index] = true
}

const markAsRead = async (id) => {
  try {
    await notificationsStore.markAsRead({id})
    await fetchNotifications()
  } catch (e) {
    catchErrors(e)
  }
}

// Composables
const options = {
  pageSize: config.NOTIFICATIONS_PAGE_SIZE
}
const paginate = usePaginate(fetchNotifications, options)

fetchNotifications()

</script>
