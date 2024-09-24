<template>
  <nav
      class="sticky top-0 bg-white border-b border-[#E5E7E7] w-full z-[3] md:flex-row md:flex-nowrap md:justify-start hidden md:flex items-center pl-[50px] pr-4 pt-[30px] pb-[27px]"
  >
    <div
        class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap"
    >
     <div class="flex justify-between items-center main-container pl-0 flex-wrap gap-y-2">
       <div v-if="route.name === 'Task Detail'" class="cursor-pointer inline-flex font-semibold text-[22px] text-black-c" contenteditable="true" ref="editable" v-focus-end plaintext-only="true" @focus="moveCursorToEnd" @input="saveData($event,'task')">{{ taskTitle }}</div>
       <div v-else-if="route.name === 'Project Detail'" class="cursor-pointer inline-flex font-semibold text-[22px] text-black-c" contenteditable="true" ref="editable" v-focus-end plaintext-only="true" @focus="moveCursorToEnd" @input="saveData($event,'project')">{{ projectTitle }}</div>
       <a
           v-else
           class="text-black text-[22px] uppercase hidden md:inline-block font-semibold"
           href="javascript:void(0)"
       >
         {{ route.name || 'Dashboard' }}
       </a>

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
       <div v-if="task.is_closed" class="text-md font-semibold text-red-c">
         THIS TASK IS CLOSED
       </div>
       <div v-if="project.is_closed" class="text-md font-semibold text-red-c">
         THIS PROJECT IS CLOSED
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
import {useProjectStore} from "../../store/project";

const userStore = useUserStore()
const taskStore = useTasksStore()
const projectStore = useProjectStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()
const route = useRoute()
const task = ref({})
const project = ref({})
const taskTitle = ref('')
const projectTitle = ref('')
const editable = ref(null);


//Watch
watch(taskStore.$state,(val)=>{
  if (Object.keys(val.task).length){
    task.value = val.task
    taskTitle.value = val.task.title
  }
})

watch(projectStore.$state,(val)=>{
  if (Object.keys(val.project).length){
    project.value = val.project
    projectTitle.value = val.project.title
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
const updateProjectTitle = async (title) => {
  try {
    const data = {
      id: project.value.id,
      title: title,
    }
    await projectStore.updateProject(data)
  } catch (e) {
    if (e.response?.data?.title[0] === 'This field may not be blank.'){
      projectTitle.value = project.value.title
    }
    catchErrors(e)
  }
}

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

const saveData = async(e,type)=>{
  const plainText = e.target.innerText.replace(/&nbsp;/g, ' ');
  if (type === 'task'){
    taskTitle.value = plainText
    moveCursorToEnd()
    return await updateTask(plainText)
  }

  projectTitle.value = plainText
  moveCursorToEnd()
  await updateProjectTitle(plainText)
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

const moveCursorToEnd = () => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(editable.value);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
};
</script>

<style scoped>
.main-container{
  padding-left: 0 !important;
}
</style>
