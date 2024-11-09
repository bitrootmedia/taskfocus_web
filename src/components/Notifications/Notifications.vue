<template>
  <div ref="componentRef">
<!--    @click="show = !show"-->
    <div class="text-white relative mr-4 cursor-pointer">
<!--      <IconWrapper>-->
<!--        <template #icon>-->
<!--          <BellIcon />-->
<!--        </template>-->
<!--      </IconWrapper>-->
      <span
          v-if="notificationsStore.notificationsCount"
          class="absolute text-xs rounded-full w-4 h-4 text-white flex items-center justify-center bg-red-c -top-4 -right-3">{{
          notificationsStore.notificationsCount
        }}</span>
    </div>

    <div
        class="notifications-wrapper absolute ml-4 sm:ml-0 right-4 sm:right-6 top-[80px] sm:top-[65px] w-[355px] sm:w-[460px] max-h-[520px] border border-blueGray-200 overflow-y-scroll bg-white px-6 py-6 rounded-[4px] shadow-lg"
        v-if="show">

      <h2 class="text-black-c text-2xl font-semibold mb-4">Notifications</h2>

      <div v-if="notifications.length && notificationsStore.notificationsCount"
           class="rounded-[4px] px-4 py-3 mb-3 bg-notes-c"
           v-for="(item,index) in notifications"
           :key="item.id">
        <div class="flex justify-between mb-3 items-center">
          <h4 class="text-xl font-semibold text-black-c">{{ item.notification.tag }}</h4>
          <Button
              @on-click="markAsRead(item.id)"
              :disabled="btnLoad"
              label="Close"
              size="medium"
              version="green"
          />
        </div>

        <div class="text-black-c text-sm w-full" :class="{'text-line-3': !readMore[index]}">
          {{ item.notification.content }}
        </div>

        <div v-if="item.notification.content.length > 120 && !readMore[index]">
          <span class="cursor-pointer font-semibold underline mt-1 text-black-c text-sm"
                @click.stop="readMoreText(index)">Read More</span>
        </div>

        <div class="mt-2 text-xs text-black-c">
          <span v-if="item.notification.task" class="block">Task:
          <router-link :to="`/dashboard/task/${item.notification.task.id}`" class="underline">{{
              item.notification.task.title
            }}</router-link>
          </span>

          <span v-if="item.notification.project" class="block">Project:
          <router-link :to="`/dashboard/project/${item.notification.project.id}`" class="underline">{{
              item.notification.project.title
            }}</router-link>
          </span>
        </div>

        <div class="flex justify-end text-black-c font-semibold text-sm mt-2">
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
import BellIcon from "../Svg/BellIcon.vue";
import IconWrapper from "../Svg/IconWrapper/IconWrapper.vue";
import Button from '../Button/Button.vue'


const props = defineProps({
  mode: {
    type: String,
    default: ''
  }
})

const notificationsStore = useNotifications()

//State
const componentRef = ref()
const btnLoad = ref(false)
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
      status: 'UNREAD',
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
    btnLoad.value = true
    await notificationsStore.markAsRead({id})
    await fetchNotifications()
  } catch (e) {
    catchErrors(e)
  }finally {
    btnLoad.value = false
  }
}

// Composables
const options = {
  pageSize: config.NOTIFICATIONS_PANEL_SIZE
}
const paginate = usePaginate(fetchNotifications, options)

fetchNotifications()

</script>
