<template>
  <nav
      class="sticky top-0 bg-white border-b border-[#E5E7E7] w-full z-10 md:flex-row md:flex-nowrap md:justify-start hidden md:flex items-center pl-[50px] pr-4 pt-[30px] pb-[27px]"
  >
    <div
        class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap"
    >
      <a
          class="text-black text-[22px] uppercase hidden md:inline-block font-semibold"
          href="javascript:void(0)"
      >
        {{ route.name || 'Dashboard' }}
      </a>


      <div v-if="userStore.showPanel.show" class="hidden md:flex gap-x-4">
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

      <div class="flex items-center">
        <div>
          <Notifications/>
        </div>

        <span class="text-black text-sm mr-4 flex items-center gap-x-2">
           <IconWrapper>
            <template #icon>
              <UserIcon/>
            </template>
          </IconWrapper>
          {{ fullName }}
        </span>
        <span class="cursor-pointer text-black text-sm flex items-center gap-x-2" @click="logout">
           <IconWrapper>
            <template #icon>
              <LogoutIcon/>
            </template>
          </IconWrapper>
          Logout
        </span>
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
import IconWrapper from "../Svg/IconWrapper/IconWrapper.vue";
import UserIcon from "../Svg/UserIcon.vue";
import LogoutIcon from "../Svg/LogoutIcon.vue";
import Button from '../Button/Button.vue'

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
