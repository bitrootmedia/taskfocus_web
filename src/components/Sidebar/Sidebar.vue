<template>
  <nav
      class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap shadow-xl bg-white flex flex-wrap items-center justify-between relative z-10 py-4"
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
          <img :src="config.LOGO_URL" alt="thumbnail" v-if="closePanel">
          <span v-else>{{config.PROJECT_NAME}}</span>
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
                    class="fas fa-map-marked mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Projects' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/user-guide" exact v-slot="{ href, navigate, isActive, isExactActive }">
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
                    class="fas fa-user mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'User Guide' : '' }}
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/dashboard/users-tasks" exact v-slot="{ href, navigate, isActive, isExactActive }">
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
                    class="fas fa-user mr-2 text-sm"
                    :class="[isExactActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ !closePanel ? 'Users Tasks' : '' }}
              </a>
            </router-link>
          </li>
        </ul>
      </div>
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

const emit = defineEmits(['update:closePanel'])
const props = defineProps({
  closePanel: {
    type: Boolean,
    default: false
  },
})

const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const showMobile = ref(false)
const router = useRouter()

// State
const collapseShow = ref('hidden')


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
    toast.success("Successfully logout");
    delete axios.defaults.headers.common['Authorization'];
    await router.push('/')
  }
}

onMounted(()=>{
  if (window.innerWidth < 600) showMobile.value = true
})

</script>


