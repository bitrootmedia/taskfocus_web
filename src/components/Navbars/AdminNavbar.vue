<template>
  <nav
      class="sticky top-0 bg-emerald-600 w-full z-10 md:flex-row md:flex-nowrap md:justify-start hidden md:flex items-center p-4"
  >
    <div
        class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap"
    >
      <a
          class="text-white text-sm uppercase hidden md:inline-block font-semibold"
          href="javascript:void(0)"
      >
        {{ route.name || 'Dashboard' }}
      </a>


      <div v-if="userStore.showPanel.show" class="hidden md:flex gap-x-4">
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

      <div class="flex items-center">
        <div>
          <Notifications/>
        </div>

        <span class="text-white font-medium mr-4 flex items-center gap-x-2">
          <i class="fas fa-user-circle text-blueGray-300 text-lg"></i>
          {{ fullName }}
        </span>
        <span class="cursor-pointer text-white font-medium" @click="logout">Logout</span>
      </div>

    </div>
  </nav>
</template>


<script setup>
import {useUserStore} from "../../store/user";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";
import axios from "axios";
import Notifications from "../../components/Notifications/Notifications.vue";

const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()
const route = useRoute()


// Computed
const fullName = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')

  if (user.first_name || user.last_name) return user.first_name + ' ' + user.last_name

  return user.username
})


// Methods
const logout = async () => {
  try {
    await userStore.logout()
  } catch (e) {
  } finally {
    cookies.remove('task_focus_token')
    cookies.remove('task_focus_user')
    delete axios.defaults.headers.common['Authorization'];
    toast.success("See you later!");
    await router.push('/')
  }
}
</script>
