<template>
  <nav
      id="sidebar"
      class="z-[2] sticky top-0 md:static md:left-0 pt-[10px] md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap shadow-xl bg-[#182128] flex flex-wrap items-center justify-between relative pb-[10px] md:pb-0 px-4 md:px-0"
      :class="{'md:w-[312px]': !closePanel, 'md:w-[100px]': closePanel}"
  >
    <span @click="emit('update:closePanel',!closePanel)"
          class="w-10 h-10 bg-[#182128] hidden md:flex rounded-full flex items-center justify-center cursor-pointer absolute -right-[20px] top-[25px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               :class="{'rotate-180': !closePanel}">
          <path d="M9 4.5L16.5 12L9 19.5" stroke="white" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
       </svg>
    </span>

    <div
        class="bg-[#182128] md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
    >
      <!-- Toggler -->
      <div class="flex md:justify-between md:px-[10px]">
        <button
            class="cursor-pointer text-white md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            v-on:click="toggleCollapseShow('m-2 py-3 px-0')"
        >
          <i class="fas fa-bars text-white"></i>
        </button>
        <!-- Brand -->
        <router-link
            class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold"
            to="/"
        >
          <img v-if="!closePanel" src="/public/logo-dark.png" alt="thumbnail" class="w-[140px]">
          <img v-else src="/public/logo-closed.png" alt="thumbnail" class="w-[64px]">
        </router-link>
      </div>
      <!-- User -->
      <div class="flex md:hidden items-center">
        <div v-if="showMobile">
          <Notifications :mode="'dark'"/>
        </div>
        <span class="cursor-pointer font-medium text-white" @click="logout">Logout</span>
      </div>
      <!-- Collapse -->
      <div
          class="bg-[#182128] md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded"
          v-bind:class="collapseShow"
      >
        <!-- Collapse header -->
        <div
            class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200 px-4"
        >
          <div class="flex flex-wrap">
            <div class="w-6/12">
              <router-link
                  class="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                  to="/"
              >
                Aye aye captain
              </router-link>
            </div>
            <div class="w-6/12 flex justify-end">
              <button
                  type="button"
                  class="cursor-pointer text-white md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  v-on:click="toggleCollapseShow('hidden')"
              >
                <i class="fas fa-times text-white"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- Form -->
        <form class="mt-6 mb-4 md:hidden px-4">
          <div class="mb-3 pt-0">
            <input
                type="text"
                placeholder="Search"
                class="border-0 px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
            />
          </div>
        </form>

        <ul class="md:flex-col md:min-w-full flex flex-col list-none">
          <li class="items-center">
            <router-link
                to="/dashboard"
                v-slot="{ href, navigate, isActive, isExactActive  }"
            >
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <DashboardIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Dashboard' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/create-task" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <NewTaskIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'New Task' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/projects" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <ProjectsIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Projects' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/tasks" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <TasksIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Tasks' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/reminders" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block relative"
                  :class="[
                  isExactActive
                     ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <RemindersIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Reminders' : '' }}

                <!--                <div v-if="taskStore.expiredRemindersCount" class="text-white absolute mr-6 cursor-pointer top-[5px] left-[180px]" >-->
                <!--                  <i class="fas fa-bell text-md text-red-500" ></i>-->
                <!--                </div>-->
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/comments" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <CommentsIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Comments' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/attachments" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <AttachmentsIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Attachments' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/notifications" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                     ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <NotificationsIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Notifications' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/logs" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <LogsIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Logs' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-if="userConfig?.extra_menu_links">
            <router-link to="/dashboard/tasks-tracking" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                     ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <TimeTrackerIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Time Tracker' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/users" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                     closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <UsersIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Users' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/user-settings" exact v-slot="{ href, navigate, isActive, isExactActive }">
              <a
                  :href="href"
                  @click="navigate"
                  class="flex gap-x-2 items-center text-lg py-3 font-medium block"
                  :class="[
                  isExactActive
                    ? 'bg-[#41525B] text-orange-c hover:text-orange-c-600'
                    : 'text-white hover:text-orange-c',
                    closePanel ? 'text-center pl-[38px]' : 'pl-4 md:pl-[50px]'
                ]"
              >
                <SettingsIcon :isExactActive="isExactActive"/>
                {{ !closePanel ? 'Settings' : '' }}
              </a>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="userStore.showPanel.show" class="w-full flex md:hidden justify-center gap-x-4 mt-4 pb-1">
      <Button
          @on-click="userStore.showPanel.update"
          label="Save Changes"
          size="medium"
          version="yellow"
      />
      <Button
          @on-click="userStore.showPanel.close"
          label="Discard Changes"
          size="medium"
          version="green"
      />
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
import Notifications from "../../components/Notifications/Notifications.vue";
import DashboardIcon from "../Svg/DashboardIcon.vue";
import ProjectsIcon from "../Svg/ProjectsIcon.vue";
import TasksIcon from "../Svg/TasksIcon.vue";
import NewTaskIcon from "../Svg/NewTaskIcon.vue";
import RemindersIcon from "../Svg/RemindersIcon.vue";
import NotificationsIcon from "../Svg/NotificationsIcon.vue";
import UsersIcon from "../Svg/UsersIcon.vue";
import SettingsIcon from "../Svg/SettingsIcon.vue";
import LogsIcon from "../Svg/LogsIcon.vue";
import CommentsIcon from "../Svg/CommentsIcon.vue";
import AttachmentsIcon from "../Svg/AttachmentsIcon.vue";
import TimeTrackerIcon from "../Svg/TimeTrackerIcon.vue";
import {catchErrors} from "../../utils";
import moment from "moment";
import {useTasksStore} from "../../store/tasks";
import Button from '../Button/Button.vue'

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
  if (user.first_name || user.last_name) return user.first_name + ' ' + user.last_name
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

onMounted(() => {
  if (window.innerWidth < 600) showMobile.value = true
})

const fetchUser = async () => {
  try {
    const id = cookies.get('task_focus_user').pk
    if (id) {
      const resp = await userStore.fetchCurrentUser({id})
      userConfig.value = resp.data.config
    }
  } catch (e) {
    catchErrors(e)
  }
}

const fetchReminders = async () => {
  try {
    const resp = await taskStore.fetchReminders()
    resp.data.results.forEach((reminder) => {
      if (reminderCheck(reminder.reminder_date) === 'today') {
        return taskStore.expiredRemindersCount = true
      }
    })
  } catch (e) {
    catchErrors(e)
  }
}

const reminderCheck = (date) => {
  const isToday = moment(0, "HH").diff(date, "days") >= 0
  const isTmr = moment(0, "HH").diff(date, "days") === -1

  if (isToday) return 'today'
  if (isTmr) return 'tmr'

  return ''
}

fetchReminders()
fetchUser()

</script>




