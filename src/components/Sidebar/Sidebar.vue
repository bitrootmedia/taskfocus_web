<template>
  <nav
      class="sticky top-0 md:static md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap shadow-xl bg-white flex flex-wrap items-center justify-between relative z-10 py-4"
      :class="{'md:w-64 px-4 sm:px-6': !closePanel, 'md:w-16 px-2': closePanel}"
  >
    <span v-if="closePanel" @click="emit('update:closePanel',false)"
          class="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer absolute -right-[10px] top-1/2">
       <i class="text-lg fas fa-chevron-circle-right text-blueGray-400"></i>
    </span>

    <div
        class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
    >
      <!-- Toggler -->
      <div class="flex md:justify-between">
        <button
            class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            v-on:click="toggleCollapseShow('bg-white m-2 py-3 px-6')"
        >
          <i class="fas fa-bars"></i>
        </button>
        <!-- Brand -->
        <router-link
            class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
        >
          <img src="/public/logo.png" alt="thumbnail" class="w-[140px]">

          <!--          <img v-if="config.LOGO_URL && closePanel" :src="config.LOGO_URL" alt="thumbnail">-->
<!--          <span v-else-if="!closePanel">{{config.PROJECT_NAME}}</span>-->
        </router-link>

        <button
            v-if="!closePanel"
            @click="emit('update:closePanel',true)"
            class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded hidden md:block outline-none focus:outline-none"
            type="button"
        >
          <i class="fas fa-expand text-blueGray-600"></i>
        </button>
      </div>
      <!-- User -->
      <div class="flex md:hidden items-center">
        <div v-if="showMobile">
          <Notifications :mode="'dark'"/>
        </div>
        <span class="cursor-pointer font-medium text-blueGray-600" @click="logout">Logout</span>
      </div>
      <!-- Collapse -->
      <div
          class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded"
          v-bind:class="collapseShow"
      >
        <!-- Collapse header -->
        <div
            class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200"
        >
          <div class="flex flex-wrap">
            <div class="w-6/12">
              <router-link
                  class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                  to="/"
              >
                Task Focus
              </router-link>
            </div>
            <div class="w-6/12 flex justify-end">
              <button
                  type="button"
                  class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  v-on:click="toggleCollapseShow('hidden')"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- Form -->
        <form class="mt-6 mb-4 md:hidden">
          <div class="mb-3 pt-0">
            <input
                type="text"
                placeholder="Search"
                class="border-0 px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
            />
          </div>
        </form>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full"/>
        <!-- Navigation -->

        <ul class="md:flex-col md:min-w-full flex flex-col list-none">
          <li class="items-center">
            <router-link
                to="/dashboard"
                v-slot="{ href, navigate, isActive, isExactActive  }"
            >
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-tv mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Dashboard' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/create-task" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-newspaper mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'New Task' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/projects" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-project-diagram mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Projects' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/tasks" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-tasks mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Tasks' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/reminders" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block relative"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-head-side-mask mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Reminders' : '' }}

                <div v-if="taskStore.expiredRemindersCount" class="text-white absolute mr-6 cursor-pointer top-[6px] left-[96px]" >
                  <i class="fas fa-bell text-md text-red-500" ></i>
                </div>
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/comments" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-comments mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Comments' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/attachments" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-images mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Attachments' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center" >
            <router-link to="/dashboard/notifications" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-bell mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Notifications' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/logs" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-bug mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Logs' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/tasks-tracking" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-calendar-day mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Time Tracker' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/users" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-users mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Users' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/user-settings" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="text-xs uppercase py-3 font-bold block"
                  :class="[
                  isExactActive
                    ? 'text-emerald-500 hover:text-emerald-600'
                    : 'text-blueGray-700 hover:text-blueGray-500',
                    closePanel ? 'text-center' : ''
                ]"
              >
                <i
                    class="fas fa-cog mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Settings' : '' }}
              </a>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="userStore.showPanel.show" class="w-full flex md:hidden justify-center gap-x-4">
      <button
          @click="userStore.showPanel.update"
          class="whitespace-nowrap bg-orange-400 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
      >
        Save Changes
      </button>
      <button
          @click="userStore.showPanel.close"
          class="whitespace-nowrap bg-gray-600 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
      >
        Discard Changes
      </button>
    </div>
  </nav>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useUserStore} from "../../store/user";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import axios from "axios";
import config from '../../config'
import Notifications from "../../components/Notifications/Notifications.vue";
import {catchErrors} from "../../utils";
import moment from "moment";
import {useTasksStore} from "../../store/tasks";

const emit = defineEmits(['update:closePanel'])
const props = defineProps({
  closePanel: {
    type: Boolean,
    default: false
  },
})

const userStore = useUserStore()
const taskStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()
const showMobile = ref(false)
const router = useRouter()

// State
const collapseShow = ref('hidden')
const userConfig = ref(null)


// Computed
const fullName = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  if (user.first_name || user.last_name) return user.first_name + ' ' +user.last_name
  return user.username
})


// Methods
const toggleCollapseShow = (classes) => {
  collapseShow.value = classes;
}

const logout = async () => {
  try {
    await userStore.logout()
  } catch (e) {
  } finally {
    cookies.remove('token')
    cookies.remove('user')
    toast.success("See you later!");
    delete axios.defaults.headers.common['Authorization'];
    await router.push('/')
  }
}

onMounted(()=>{
  if (window.innerWidth < 600) showMobile.value = true
})

const fetchUser = async () => {
  try {
    const id = cookies.get('task_focus_user').pk
    if (id) {
      const resp = await userStore.fetchCurrentUser({id})
      userConfig.value =resp.data.config
    }
  } catch (e) {
    catchErrors(e)
  }
}

const fetchReminders = async()=>{
  try {
    const resp = await taskStore.fetchReminders()
    resp.data.results.forEach((reminder)=>{
      if (reminderCheck(reminder.reminder_date) === 'today') {
        return taskStore.expiredRemindersCount = true
      }
    })
  }catch (e) {
    catchErrors(e)
  }
}

const reminderCheck = (date)=>{
  const isToday = moment(0, "HH").diff(date, "days") >= 0
  const isTmr = moment(0, "HH").diff(date, "days") === -1

  if (isToday) return 'today'
  if (isTmr) return 'tmr'

  return ''
}

fetchReminders()
fetchUser()

</script>


