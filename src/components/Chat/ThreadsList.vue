<template>
  <div class="users-list w-1/2 border border-light-bg-c rounded-[10px] px-4 py-3 bg-white shadow-md relative flex flex-col justify-between">
    <div>
      <div>
        <h2 class="text-center font-semibold text-2xl text-black-c block mb-1">Threads</h2>

        <input
            type="text"
            class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Threads Search..."
        />
      </div>

      <ul class="mt-8">
        <li class="sm:whitespace-nowrap mb-2 last:mb-0 px-3 py-1.5 cursor-pointer hover:bg-light-bg-c transition-all">
          <p class="text-[13px] text-light-c font-medium">Project A (9) 2 min ago</p>

          <div class="ml-2 flex flex-col">
            <span class="text-[13px] text-light-c font-medium">- Task A1 (2)</span>
            <span class="text-[13px] text-light-c font-medium">- Task A2 (7)</span>
          </div>
        </li>
        <li class="sm:whitespace-nowrap mb-2 last:mb-0 px-3 py-1.5 cursor-pointer hover:bg-light-bg-c transition-all">
          <p class="text-[13px] text-light-c font-medium">Task B</p>
        </li>
        <li class="sm:whitespace-nowrap mb-2 last:mb-0 px-3 py-1.5 cursor-pointer hover:bg-light-bg-c transition-all">
          <p class="text-[13px] text-light-c font-medium">Task C</p>
        </li>

        <!--      <li v-for="user in users"-->
        <!--          :key="user.id"-->
        <!--          class="flex gap-x-1 items-center whitespace-nowrap mb-2 last:mb-0 px-3 py-1.5 cursor-pointer hover:bg-light-bg-c transition-all"-->
        <!--          @click="emit('update:activeUser', user)"-->
        <!--      >-->
        <!--        <span class="text-[13px] text-light-c font-medium">{{ user.username }}</span>-->

        <!--        <span class="text-[13px] text-light-c font-medium">(3)</span>-->

        <!--        <span class="text-[13px] text-light-c font-medium">5 min ago</span>-->
        <!--      </li>-->
      </ul>
    </div>

    <div class="flex justify-center">
      <Button
          class="max-w-[200px] justify-center"
          @on-click="startNewThread"
          label="Start New Thread"
          size="medium"
          version="green"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import Button from "../Button/Button.vue";
import {catchErrors} from "../../utils/index.js";
import {useConversationsStore} from "../../store/conversations.js";

const emit = defineEmits([''])
const props = defineProps({
  activeThread: {
    type: Object,
    required: false
  }
})

//Store
const conversationsStore= useConversationsStore()

//State
const threads = ref([])


const startNewThread = () => {

}


//Methods
const fetchAllThreads = async()=>{
  try {
    const resp = await conversationsStore.fetchAllThreads()
    console.log(resp.data.results,'resp.data.results')
    threads.value = resp.data.results
  } catch (e) {
    catchErrors(e)
  }
}


//Run Functions
fetchAllThreads()
</script>
