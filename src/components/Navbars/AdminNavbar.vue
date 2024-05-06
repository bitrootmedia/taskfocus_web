<template>
  <nav
      class="sticky top-0 bg-white border-b border-[#E5E7E7] w-full z-[1] md:flex-row md:flex-nowrap md:justify-start hidden md:flex items-center pl-[50px] pr-4 pt-[30px] pb-[27px]"
  >
    <div
        class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap"
    >
     <div class="flex justify-between items-center main-container pl-0 flex-wrap gap-y-2">
       <a
           v-if="route.name !== 'Task Detail'"
           class="text-black text-[22px] uppercase hidden md:inline-block font-semibold"
           href="javascript:void(0)"
       >
         {{ route.name || 'Dashboard' }}
       </a>
       <div v-else class="cursor-pointer inline-flex font-semibold text-[22px] text-black-c" contenteditable="true"  plaintext-only="true" @input="saveData($event)">{{ taskTitle }}</div>

       <div v-if="userStore.showPanel.show" class="hidden md:flex gap-x-4 flex-wrap">
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
import {computed, ref, watch} from "vue";
import axios from "axios";
import Notifications from "../../components/Notifications/Notifications.vue";
import IconWrapper from "../Svg/IconWrapper/IconWrapper.vue";
import UserIcon from "../Svg/UserIcon.vue";
import LogoutIcon from "../Svg/LogoutIcon.vue";
import Button from '../Button/Button.vue'
import {useTasksStore} from "../../store/tasks";
import {catchErrors} from "../../utils";

const userStore = useUserStore()
const taskStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()
const route = useRoute()
const task = ref({})
const taskTitle = ref('')


//Watch
watch(taskStore.$state,(val)=>{
  if (Object.keys(val.task).length){
    task.value = val.task
    taskTitle.value = val.task.title
  }
})


// Computed
const fullName = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')

  if (user.first_name || user.last_name) return user.first_name + ' ' + user.last_name

  return user.username
})

const isAuthOwner = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  const taskOwnerId = task.value.owner?.id

  return user.pk === taskOwnerId
})


// Methods
const updateTask = async (title) => {
  try {
    const data = {
      id: taskStore.$state.task.id,
      title: title,
    }

    await taskStore.updateTask(data)
  } catch (e) {
    if (e.response?.data?.title[0] === 'This field may not be blank.'){
      taskTitle.value = task.value.title
    }

    catchErrors(e)
  }
}

const saveData = async(e)=>{
  const plainText = e.target.innerText.replace(/&nbsp;/g, ' ');
  taskTitle.value = plainText
  await updateTask(plainText)
}

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

<style scoped>
.main-container{
  padding-left: 0 !important;
}
</style>
