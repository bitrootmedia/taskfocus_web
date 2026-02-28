<template>
  <div
      class="users-list w-1/2 border border-light-bg-c rounded-[10px] px-4 py-3 bg-white shadow-md relative flex flex-col justify-between">
    <div>
      <div>
        <h2 class="text-center font-semibold text-2xl text-black-c block mb-1">Threads</h2>

        <input
            type="text"
            class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Threads Search..."
        />
      </div>

      <ul class="mt-8" v-if="threads.length">
        <li v-for="thread in threads"
            :key="thread.thread"
            class="flex gap-x-1 items-center whitespace-nowrap mb-2 last:mb-0 px-3 py-1.5 cursor-pointer hover:bg-light-bg-c transition-all"
            :class="{'bg-orange-c': activeThread?.thread === thread.thread}"
            @click="emit('update:activeThread', thread)"
        >
          <div class="flex items-center flex-wrap gap-2 justify-between w-full text-light-c">
            <div class="flex items-center">
              <span class="text-md font-semibold truncate ">{{
                  thread.project?.title || thread.task?.title
                }}</span>

              <span v-if="thread.unread_count" class="text-xs font-medium">({{ thread.unread_count }})</span>
            </div>

            <span class="text-xs font-medium" v-if="thread.last_unread_message_date">{{ convertTimeAgo(thread.last_unread_message_date) }}</span>
          </div>
        </li>
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
import {ref, watch} from "vue";
import Button from "../Button/Button.vue";
import {catchErrors, convertTimeAgo} from "../../utils/index.js";
import {useConversationsStore} from "../../store/conversations.js";

const emit = defineEmits([''])
const props = defineProps({
  activeThread: {
    type: Object,
    required: false
  },
  activeUser: {
    type: Object,
    required: false
  }
})

//Store
const conversationsStore = useConversationsStore()

//State
const threads = ref([])


watch(() => props.activeUser, (val) => {
  if (val.id) {
    fetchUserThreads(val.id)
  }
})


const startNewThread = () => {

}


//Methods
const fetchUserThreads = async (id) => {
  try {
    const resp = await conversationsStore.fetchUserThreads({id})
    threads.value = resp.data
  } catch (e) {
    catchErrors(e)
  }
}

const fetchAllThreads = async () => {
  try {
    const resp = await conversationsStore.fetchAllThreads()
    console.log(resp.data, '1111')
    threads.value = resp.data.results
  } catch (e) {
    catchErrors(e)
  }
}


//Run Functions
fetchAllThreads()
</script>
