<template>
  <nav
      class="absolute bg-emerald-600 top-0 left-0 w-full z-10 md:flex-row md:flex-nowrap md:justify-start hidden md:flex items-center p-4"
  >
    <div
        class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap"
    >
      <a
          class="text-white text-sm uppercase hidden lg:inline-block font-semibold"
          href="javascript:void(0)"
      >
        {{route.name || 'Dashboard' }}
      </a>

      <div class="flex items-center">
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
import {catchErrors} from "../../utils";
import {computed} from "vue";
import axios from "axios";

const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()
const route = useRoute()


// Computed
const fullName = computed(() => {
  if (!cookies.get('crowdsteer_user')) return ''

  const user = cookies.get('crowdsteer_user')

  if (user.first_name || user.last_name) return user.first_name + user.last_name

  return user.username
})


// Methods
const logout = async () => {
  try {
    await userStore.logout()
  } catch (e) {
  }finally {
    cookies.remove('crowdsteer_token')
    cookies.remove('crowdsteer_user')
    delete axios.defaults.headers.common['Authorization'];
    toast.success("Successfully logout");
    await router.push('/')
  }
}
</script>
