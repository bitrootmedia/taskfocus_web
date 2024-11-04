<template>
  <div class="relative" ref="componentRef">
    <SettingsIcon :isExactActive="true" class="cursor-pointer" @click="showDropdown = !showDropdown"/>

    <ul ref="dropdown" v-if="showDropdown"
        class="absolute bg-white border border-[#E5E7E7] rounded-md shadow-sm min-w-[100px] right-0 top-[30px] py-2">
      <li class="text-sm flex items-center gap-x-1 py-1 px-4 whitespace-nowrap cursor-pointer hover:bg-light-bg-c transition-all ease-in-out"
          @click="deleteBoard">
        Delete Board
      </li>
      <li class="text-sm flex items-center gap-x-1 py-1 px-4 whitespace-nowrap cursor-pointer hover:bg-light-bg-c transition-all ease-in-out">
        Manage Board Users
      </li>
    </ul>

  </div>
</template>

<script setup>
import SettingsIcon from "../Svg/SettingsIcon.vue";
import {catchErrors} from "../../utils/index.js";
import {useRoute, useRouter} from "vue-router";
import {useBoardsStore} from "../../store/boards.js";
import {useToast} from "vue-toastification";
import {onBeforeUnmount, onMounted, ref} from "vue";


//Store
const router = useRouter()
const route = useRoute()
const toast = useToast()
const boardsStore = useBoardsStore()


//State
const showDropdown = ref(false)
const componentRef = ref()

//Methods
const deleteBoard = async () => {
  try {
    const data = {
      id: route.params.id,
    }
    await boardsStore.deleteBoard(data)
    await router.push('/dashboard/boards')
    toast.success("Successfully deleted!");
    close()
  } catch (e) {
    catchErrors(e)
  }
}

const close = () => {
  showDropdown.value = false
}

const handleOutsideClick = (e) => {
  if (!componentRef.value.contains(e.target)) close()
}

onMounted(() => {
  window.addEventListener('click', handleOutsideClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>

</style>
