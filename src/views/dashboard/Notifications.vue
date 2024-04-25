<template>
  <div class="main-container">
    <div class="content mt-6 mb-6">

      <div class="header mb-3">
        <h2 class="font-semibold text-xl block text-black-c ">Notifications</h2>

        <div v-if="!route.query.id" class="mt-3">
          <CheckBox id="hideClosed" label="Hide seen notifications" v-model:value="hideSeen"/>
        </div>
      </div>


      <Loader v-if="loading" />

      <div v-else-if="!notifications.length">
        <p class="flex text-center px-4 justify-center py-8 text-black-c text-3xl font-medium">
          No data found
        </p>
      </div>

      <div v-else class="shadow-lg rounded-[4px] px-4 py-3 mb-4"
           :class="[`${item.status === 'UNREAD' ? 'bg-notes-c' : ''}`]"
           v-for="(item,index) in notifications"
           :key="item.id">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-xl font-semibold text-black-c">{{ item.notification.tag }}</h4>
          <Button
              v-if="item.status === 'UNREAD'"
              @on-click="markAsRead(item.id)"
              :disabled="loading"
              label="Close"
              size="medium"
              version="green"
          />
        </div>

        <div class="text-black-c text-sm w-full sm:w-11/12" :class="{'text-line-3': !readMore[index]}">
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
import {ref, watch} from "vue";
import {catchErrors} from "../../utils";
import config from "../../config";
import {convertTimeAgo} from "../../utils";
import {usePaginate} from "../../composables/usePaginate";
import {useNotifications} from "../../store/notifications";
import Pagination from './../../components/Pagination/Pagination.vue'
import {useRoute} from "vue-router";
import CheckBox from '../../components/CheckBox/CheckBox.vue'
import Button from '../../components/Button/Button.vue'


const notificationsStore = useNotifications()
const route = useRoute()

//State
const loading = ref(true)
const hideSeen = ref(true)
const readMore = ref([])
const notifications = ref([])


//Watch
watch(hideSeen,()=>{
  if (!route.query.id){
    fetchNotifications()
  }
})


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
      status: hideSeen.value ? 'UNREAD' : '',
      id: route.query?.id || null,
      isNeedUpdate,
    }

    if (route.query?.id) delete options.status

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

